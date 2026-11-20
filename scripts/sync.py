# sync.py <hero-bajka> : kopiuje zbudowaną stronę do katalogu wdrożenia (uruchom w nim), potem: python scripts/seo_porzadek.py scripts/lastmod.json
import io,os,re,sys,shutil
SRC=os.path.abspath(sys.argv[1]);D=os.path.abspath('.')
X=lambda base,p:('\\\\?\\' if os.name=='nt' else '')+os.path.join(base,p.replace('/',os.sep))
def rel(h):
    h=re.sub(r'(\s(?:src|href)=")(?!https?:|/|#|mailto:|tel:|data:)',r'\1../',h)
    return re.sub(r'url\((?!https?:|/|data:|#)',r'url(../',h)
PAGES=['strony-internetowe-od-1500-zl','przebudowa-strony-internetowej','optymalizacja-seo','cennik-tworzenia-stron-internetowych-2026','o-nas','kontakt','polityka-prywatnosci']
for f in ['v3.js','pod.css','pod.js','sceny.js','motywy.js']+[p+'.html' for p in PAGES]:shutil.copyfile(X(SRC,f),X(D,f))
shutil.copyfile(X(SRC,'v3.html'),X(D,'index.html'))
rd=lambda p:io.open(X(SRC,p),encoding='utf8').read()
io.open(X(D,'poradniki/index.html'),'w',encoding='utf8',newline='').write(rel(rd('poradniki.html')))
for f in os.listdir(SRC):
    if f.startswith('poradniki-') and f.endswith('.html'):
        io.open(X(D,'poradniki/'+f[len('poradniki-'):]),'w',encoding='utf8',newline='').write(rel(rd(f)))
print('skopiowano')
