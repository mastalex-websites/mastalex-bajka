# seo_porzadek.py [lastmod.json] : uruchom w katalogu strony przed wdrożeniem.
# 1) linki wewnętrzne na adresy kanoniczne (/kontakt zamiast kontakt.html), 2) duplikaty i stare adresy jako przekierowania,
# 3) sitemap.xml z datami lastmod (data zmienia się tylko przy zmianie treści, nie wyglądu).
import hashlib,html,io,os,re,sys,json
from datetime import date
D=os.path.abspath('.');L=('\\\\?\\'+D+'\\') if os.name=='nt' else D+'/'
N=lambda p:p.replace('/',os.sep)
def rd(p):return io.open(L+N(p),encoding='utf8').read()
def wr(p,s):
    d=os.path.dirname(N(p))
    if d:os.makedirs(L+d,exist_ok=True)
    io.open(L+N(p),'w',encoding='utf8',newline='').write(s)
SITE='https://mastalex.pl'
PAGES=['strony-internetowe-od-1500-zl','przebudowa-strony-internetowej','optymalizacja-seo','cennik-tworzenia-stron-internetowych-2026','o-nas','kontakt','polityka-prywatnosci']
GUIDES=['jak-byc-wyzej-w-google','ile-kosztuje-strona-internetowa-2026','strona-internetowa-od-1500-zl','najlepsze-firmy-tworzace-strony-internetowe-polska']
MAP={'v3':'/','index':'/','poradniki':'/poradniki/'}
for p in PAGES:MAP[p]='/'+p
for g in GUIDES:MAP['poradniki-'+g]='/poradniki/'+g
def fix(h):
    def rep(m):
        pre,name,frag=m.group(1),m.group(2),m.group(3) or ''
        return f'{pre}{MAP[name]}{frag}"' if name in MAP else m.group(0)
    return re.sub(r'(href=")(?:\.\./)?([a-z0-9-]+)\.html(#[^"]*)?"',rep,h)
# strony kanoniczne: index.html (główna), 7 podstron, poradniki/
CANON={'/':'index.html','/poradniki/':'poradniki/index.html'}
for p in PAGES:CANON['/'+p]=p+'.html'
for g in GUIDES:CANON['/poradniki/'+g]='poradniki/'+g+'.html'
for f in CANON.values():wr(f,fix(rd(f)))
def stub(path,to):
    wr(path,f'''<!doctype html>
<html lang="pl"><head><meta charset="UTF-8">
<title>Nowy adres strony | Mastalex</title>
<link rel="canonical" href="{SITE}{to}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0;url={to}">
<script>location.replace({json.dumps(to)} + location.search + location.hash)</script>
</head><body><p>Ta strona ma nowy adres. <a href="{to}">Przejdź do strony</a>.</p></body></html>
''')
# duplikaty z wersji roboczej i stare adresy (jak w starej stronie)
stub('v3.html','/');stub('poradniki.html','/poradniki/')
for g in GUIDES:stub('poradniki-'+g+'.html','/poradniki/'+g)
OLD={'strony-internetowe-od-500-zl':'/strony-internetowe-od-1500-zl','poradniki/strona-internetowa-od-500-zl':'/poradniki/strona-internetowa-od-1500-zl',
     'tworzenie-stron-internetowych':'/strony-internetowe-od-1500-zl','cennik-stron-internetowych':'/cennik-tworzenia-stron-internetowych-2026',
     'poradniki/ile-kosztuje-strona-internetowa':'/poradniki/ile-kosztuje-strona-internetowa-2026'}
for o,n in OLD.items():stub(o+'.html',n)
# Datę zmieniamy przy zmianie tekstu strony, tytułu lub metaopisu.
def content_hash(document):
    main = re.search(r'<main\b[^>]*>(.*?)</main>', document, re.S)
    title = re.search(r'<title>(.*?)</title>', document, re.S)
    description = re.search(r'<meta\b(?=[^>]*\bname="description")[^>]*\bcontent="([^"]*)"', document)
    text = re.sub(r'<(?:script|style)\b[^>]*>.*?</(?:script|style)>', '', main[1] if main else '', flags=re.S)
    text = re.sub(r'<[^>]+>', ' ', text)
    fields = [title[1] if title else '', description[1] if description else '', text]
    normalized = '\n'.join(' '.join(html.unescape(field).split()) for field in fields)
    return hashlib.sha256(normalized.encode('utf8')).hexdigest()

ledger_path = sys.argv[1] if len(sys.argv) > 1 else 'scripts/lastmod.json'
with open(ledger_path, encoding='utf8') as ledger_file:
    previous = json.load(ledger_file)
today = date.today().isoformat()
lm = {}
for route, filename in CANON.items():
    old = previous.get(route, {})
    current = content_hash(rd(filename))
    changed = old.get('content_hash', current) != current
    lm[route] = {'date': today if changed or 'date' not in old else old['date'], 'content_hash': current}
with open(ledger_path, 'w', encoding='utf8', newline='\n') as ledger_file:
    json.dump(lm, ledger_file, indent=2, ensure_ascii=False)
    ledger_file.write('\n')
urls=''.join(f'  <url><loc>{SITE}{r}</loc><lastmod>{lm[r]["date"]}</lastmod></url>\n' for r in CANON)
wr('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'</urlset>\n')
left=[(f,m) for f in CANON.values() for m in re.findall(r'href="(?:\.\./)?[a-z0-9-]+\.html[^"]*"',rd(f))]
print('stron',len(CANON),'przekierowań',len(OLD)+2+len(GUIDES),'pozostałe linki .html:',left[:5])
