export const EXPLANATIONS = {
  'null_1': "Die Standard-Nullfolge schlechthin. Der Nenner wächst unaufhaltsam an, weshalb die Werte immer kleiner werden und sich der $0$ asymptotisch annähern.",
  'null_alt': "Diese Folge springt bei jedem Schritt über die Null-Linie. Da der Nenner trotzdem wächst, werden die Sprünge immer kleiner. Wie ein Pendel kommt sie bei $a=0$ zur Ruhe.",
  'geom': "Das Verhalten hängt extrem vom Basis-Parameter $q$ ab! Für $|q| < 1$ konvergiert sie gegen $0$. Ist $|q| > 1$, explodieren die Werte.",
  'bruch': "Zähler und Nenner wachsen beide ins Unendliche! Da aber der Leitkoeffizient bei beiden $n$ ist, pendelt sich das Verhältnis bei $\\frac{2}{1} = 2$ ein.",
  'n_inv_sq': "Diese Folge fällt viel schneller als $\\frac{1}{n}$, da sie quadratisch im Nenner wächst. Schon für kleine $n$ liegen die Werte extrem nah an $0$.",
  'bruch2': "Ein rationaler Ausdruck, bei dem der Grad von Zähler und Nenner gleich ist. Der Grenzwert ergibt sich aus dem Verhältnis der Leitkoeffizienten: $\\frac{3}{1} = 3$.",
  'sqrt_folge': "Langsamer als $\\frac{1}{n}$, aber dennoch eine Nullfolge. Die Wurzel im Nenner bremst das Wachstum, weshalb die Konvergenz langsamer ist.",
  'log_n': "Der Logarithmus wächst zwar unbegrenzt, aber so langsam, dass er vom linearen Nenner $n$ problemlos dominiert wird. Resultat: Konvergenz gegen $0$.",
  'div_alt': "Divergenz in Reinkultur! Die Werte springen ewig zwischen $1$ und $-1$ hin und her. Es gibt keinen eindeutigen Grenzwert $a$.",
  'euler': "Die Euler-Folge. Sie beschreibt kontinuierliches Wachstum und konvergiert gegen die Eulersche Zahl $e \\approx 2.718$.",
  'sin_damp': "Eine klassische gedämpfte Schwingung. Der Sinus lässt die Werte pendeln, aber die Division durch $n$ zwingt die Amplitude unweigerlich auf $0$.",
  'n_sq': "Divergenz ins Unendliche. Die Werte wachsen quadratisch an ($n^2$) und entziehen sich jedem noch so großen Schwellenwert.",
  'div_linear': "Die einfachste divergente Folge: Die Werte wachsen linear und unbegrenzt. Kein $\\varepsilon$-Schlauch kann diese Folge einfangen.",
  'div_fakult': "Die Fakultät wächst schneller als jede Potenz oder Exponentialfunktion! Schon $20! > 10^{18}$. Extrem divergent.",

  'harm': "Die berühmte Harmonische Reihe ist DIVERGENT! Obwohl die einzelnen Glieder ($\\frac{1}{k}$) gegen Null gehen, tun sie das zu langsam. Die Fläche summiert sich auf $\\infty$.",
  'harm_alt': "Anders als die normale harmonische Reihe KONVERGIERT diese. Durch den Vorzeichenwechsel zieht jeder zweite Term wieder etwas ab (Grenzwert $S \\approx \\ln(2)$).",
  'geom_reihe': "Diese Reihe konvergiert NUR streng für $|q| < 1$. Sobald $q=1$ ist ($1+1+1+\\dots$), schießt die Reihe ins $\\infty$ ab.",
  'basel': "Das Basel-Problem! Im Gegensatz zu $\\frac{1}{k}$ schrumpfen die Quadrate $\\frac{1}{k^2}$ rasant schnell. Die Addition bleibt bei einer festen Zahl stehen ($\\frac{\\pi^2}{6}$).",
  'euler_e': "Die unendliche Reihe der Fakultäten konvergiert extrem schnell gegen die Eulersche Zahl $e$.",
  'teleskop': "Eine Teleskopreihe. Die inneren Terme heben sich gegenseitig auf, sodass am Ende nur der allererste Term ($1$) als Grenzwert übrig bleibt.",
  'r_p3': "Die $p$-Reihe mit $p=3$ konvergiert gegen die Apéry-Konstante $\\zeta(3) \\approx 1.202$. Für $p > 1$ konvergiert jede $p$-Reihe.",
  'r_leibniz': "Die Leibniz-Reihe konvergiert gegen $\\frac{\\pi}{4}$. Durch alternierende Vorzeichen und abnehmende Terme ergibt sich eine der elegantesten Darstellungen von $\\pi$.",
  'r_mengoli': "Pietro Mengoli untersuchte diese Reihe schon im 17. Jahrhundert. Die Partialbruchzerlegung zeigt, dass die Summe gegen $\\frac{1}{4}$ konvergiert.",
  'r_div_sqrt': "Die Terme $\\frac{1}{\\sqrt{k}}$ gehen gegen Null, aber zu langsam! Diese $p$-Reihe mit $p=\\frac{1}{2} < 1$ ist divergent.",
  'r_div_geom': "Eine geometrische Reihe mit $q=2 > 1$. Jeder Term verdoppelt sich, weshalb die Partialsummen explosionsartig wachsen.",

  'p_geom': "Die blaue Kurve passt sich der grauen Funktion NUR im Intervall von $x=-1$ bis $x=1$ an. Das ist der Konvergenzradius $R=1$!",
  'p_exp': "Das Polynom hat einen Konvergenzradius von $R=\\infty$! Je größer $N$, desto besser passt es weltweit.",
  'p_sin': "Die Taylorreihe des Sinus verwendet nur ungerade Potenzen ($x, x^3, x^5$).",
  'p_cos': "Die Taylorreihe des Kosinus verwendet nur gerade Potenzen ($1, x^2, x^4$). Wie beim Sinus ist der Konvergenzradius $R=\\infty$.",
  'p_sinh': "Der Sinus Hyperbolicus hat dieselbe Taylorreihe wie $\\sin(x)$, aber ohne die alternierenden Vorzeichen. Konvergenzradius $R=\\infty$.",
  'p_ln': "Die Logarithmus-Reihe konvergiert extrem langsam und ist nur im Bereich von $(-1, 1]$ definiert.",
  'p_atan': "Die Arkustangens-Reihe konvergiert für $|x| \\le 1$. Für $x=1$ ergibt sich die Leibniz-Reihe $\\frac{\\pi}{4}$.",

  'i_quad': "Das Integral einer Parabel berechnet die Fläche unter der Kurve. Der Flächeninhalt wächst kubisch (hoch 3). Die Riemann-Rechtecke nähern sich dieser exakten Fläche an.",
  'i_sin': "Die Fläche unter einem Sinus-Bogen. Integriert man von $0$ bis $\\pi$, ergibt sich exakt eine Fläche von $2$. Geht man weiter bis $2\\pi$, hebt sich die Fläche zu $0$ auf.",
  'i_cos': "Der Kosinus beginnt bei $1$ und schwingt wie der Sinus. Integriert von $0$ bis $\\frac{\\pi}{2}$ ergibt sich exakt $1$.",
  'i_exp': "Die Exponentialfunktion ist faszinierend: Sie ist ihre eigene Ableitung und ihr eigenes Integral! Die Fläche unter ihr wächst exponentiell.",
  'i_sqrt': "Die Wurzelfunktion steigt anfangs steil an und flacht dann ab. Die integrierte Fläche wächst entsprechend sanfter als bei der Parabel.",
  'i_poly3': "Die kubische Funktion wächst schneller als die Parabel. Das Integral ergibt $\\frac{b^4}{4}$ und wächst in der vierten Potenz.",
  'i_abs': "Der Betrag hat bei $0$ einen Knick, ist aber dennoch integrierbar. Links und rechts von $0$ wächst die Fläche symmetrisch.",
  'i_inv': "Das Integral von $\\frac{1}{z}$ ist $\\ln(z)$. Für $b \\to \\infty$ divergiert es logarithmisch (uneigentliches Integral).",

  'f_quad': "Eine perfekte, glatte Kurve. Überall stetig, überall differenzierbar, lokal Lipschitz-stetig.",
  'f_sin': "Eine harmonische Welle. Sie ist überall stetig, unendlich oft differenzierbar und GLOBAL Lipschitz-stetig.",
  'f_exp': "Die Exponentialfunktion ist überall stetig und differenzierbar ($f'(x) = e^x$). Sie ist lokal Lipschitz, aber NICHT global Lipschitz, da die Steigung unbeschränkt wächst.",
  'f_cubic': "Ein Polynom dritten Grades. Überall stetig und differenzierbar. Die Ableitung $3x^2$ ist nie negativ, aber die Funktion ist nicht global Lipschitz.",
  'f_x_abs_x': "Diese Funktion sieht aus wie eine \"glatte Parabel\". Obwohl $|x|$ einen Knick hat, glättet die Multiplikation mit $x$ diesen Knick: $f'(0) = 0$ existiert! Überall differenzierbar.",
  'f_abs': "**ACHTUNG KNICK!** Überall stetig, aber bei Null NICHT DIFFERENZIERBAR! Die Sekante springt von $-1$ auf $+1$. Sie ist jedoch global Lipschitz-stetig.",
  'f_sqrt': "**ACHTUNG STEILHEIT!** Bei Null ist die Funktion stetig. Sie ist dort jedoch NICHT DIFFERENZIERBAR (die Tangente steht senkrecht, Steigung $\\infty$). Wegen dieser unendlichen Steigung existiert in der Nähe von $0$ auch KEINE Lipschitz-Konstante $L$, die den Graphen einfangen könnte!",
  'f_sin_1_x': "Ein spannender Grenzfall: Die Funktion ist stetig (da die Amplitude gegen $0$ drückt), pendelt aber in der Nähe der Null unendlich oft hin und her. Sie ist dort nicht differenzierbar!",
  'f_sprung': "**ACHTUNG RISS!** Unstetig bei Null. Da sie reißt, ist sie dort logischerweise auch nicht differenzierbar und niemals Lipschitz-stetig.",
  'f_bruch': "**ACHTUNG ASYMPTOTE!** In der Null existiert die Funktion nicht. Der Graph flieht nach $\\pm\\infty$.",
  'f_floor': "**TREPPENFUNKTION!** Die Gaußklammer springt an jeder ganzen Zahl um $1$ nach oben. Zwischen den Sprüngen ist sie konstant (Ableitung $0$), an den Sprungstellen unstetig und nicht differenzierbar.",
  'f_heaviside': "**EINZELNER SPRUNG!** Die Heaviside-Funktion springt bei $0$ von $0$ auf $1$. Links ist sie $0$, rechts ist sie $1$. An der Sprungstelle ist sie weder stetig noch differenzierbar.",

  'mv_poly': "Das klassische Paraboloid. Total differenzierbar überall, mit Gradient $\\nabla f = (2x, 2y)$. Die Tangentialebene approximiert die Fläche perfekt.",
  'mv_prod': "Eine Sattelfläche. Total differenzierbar überall mit $\\nabla f = (y, x)$. Am Ursprung ist der Gradient $(0,0)$, dort liegt ein Sattelpunkt.",
  'mv_saddle': "Das hyperbolische Paraboloid (Pringles-Form). Total differenzierbar mit $\\nabla f = (2x, -2y)$. Die Niveaulinien sind Hyperbeln.",
  'mv_exp': "Die Exponentialfläche ist überall glatt und total differenzierbar. Beide partiellen Ableitungen sind gleich: $f_x = f_y = e^{x+y}$.",
  'mv_sin_cos': "Trigonometrische Fläche mit Wellen in beide Richtungen. Total differenzierbar überall als Komposition glatter Funktionen.",
  'mv_abs': "**ACHTUNG KANTEN!** Entlang der Achsen $x=0$ und $y=0$ entstehen Kanten. Die partiellen Ableitungen existieren dort nicht, also ist die Funktion dort nicht total differenzierbar.",
  'mv_classic': "**DAS Standardgegenbeispiel!** Die partiellen Ableitungen $f_x(0,0) = 0$ und $f_y(0,0) = 0$ existieren beide. Aber entlang $y=x$ ist $f = \\frac{1}{2}$, die Linearisierung sagt aber $0$ voraus. NICHT total differenzierbar!",
  'mv_sqrt': "Die partiellen Ableitungen existieren am Ursprung ($f_x(0,0) = f_y(0,0) = 0$), aber entlang der Diagonalen $y=x$ wächst $f = |x|$ mit Knick. Nicht total differenzierbar bei $(0,0)$!",
};

export const DEFINITIONS = {
  'folge': {
    title: "Definition: Konvergenz einer Folge ($\\varepsilon$-Kriterium)",
    math: "$$ \\forall \\varepsilon > 0 \\quad \\exists N \\in \\mathbb{N} : \\forall n \\ge N \\implies | z_n - a | < \\varepsilon $$",
    text: "Zu jeder (noch so kleinen) Fehlerschranke $\\varepsilon$ gibt es einen Index $N$, ab dem alle weiteren Folgenglieder im Schlauch um den Grenzwert $a$ liegen."
  },
  'reihe': {
    title: "Definition: Konvergenz einer Reihe (Partialsummen!)",
    math: "$$ S = \\lim_{n \\to \\infty} S_n \\quad \\text{mit} \\quad S_n = \\sum_{k=0}^n a_k $$",
    text: "WICHTIG: Eine unendliche Reihe konvergiert, wenn die Folge ihrer aufsummierten Partialsummen $S_n$ konvergiert. Der $\\varepsilon$-Schlauch umschließt den Zielwert $S$. Er gilt für die blaue Partialsummen-Linie, NICHT für die einzelnen Glieder $a_k$!"
  },
  'potenzreihe': {
    title: "Definition: Potenzreihe & Taylorpolynom",
    math: "$$ f(x) = \\sum_{k=0}^\\infty c_k (x - x_0)^k $$",
    text: "Eine Funktion wird als unendliches Polynom angenähert. Dies funktioniert nur im sogenannten Konvergenzradius $R$ um das Zentrum $x_0$."
  },
  'integral': {
    title: "Definition: Riemann-Integral",
    math: "$$ \\int_a^b f(x) \\, dx = \\lim_{N \\to \\infty} \\sum_{i=1}^N f(x_i^*) \\Delta x $$",
    text: "Das Integral entspricht dem exakten Flächeninhalt unter der Kurve. Die Riemann-Summe nähert diesen durch die Aufsummierung von $N$ unendlich schmaler Rechtecke an."
  },
  'stetigkeit': {
    title: "Definition: $\\varepsilon$-$\\delta$-Stetigkeit",
    math: "$$ \\forall \\varepsilon > 0 \\quad \\exists \\delta > 0 : |z - z_*| < \\delta \\implies |f(z) - f(z_*)| < \\varepsilon $$",
    text: "Eine Funktion ist an der Stelle $z_*$ stetig, wenn wir zu jedem $\\varepsilon$-Schlauch ein $\\delta$-Fenster finden können, sodass der Graph das Rechteck nicht verlässt."
  },
  'lipschitz': {
    title: "Definition: Lipschitz-Stetigkeit",
    math: "$$ \\exists L > 0 : \\forall x, y \\in D \\implies |f(x) - f(y)| \\le L \\cdot |x - y| $$",
    text: "Die Steigung (Sekante) zwischen zwei beliebigen Punkten darf niemals die Lipschitz-Konstante $L$ überschreiten. Der Graph muss in einen Doppel-Kegel passen."
  },
  'ableitung': {
    title: "Definition: Differentialquotient",
    math: "$$ f'(x_*) = \\lim_{h \\to 0} \\frac{f(x_* + h) - f(x_*)}{h} $$",
    text: "Die Ableitung ist der Grenzwert der Sekantensteigung, wenn sich der Abstand $h$ der beiden Punkte auf der $x$-Achse der Null nähert."
  },
  'multivar': {
    title: "Definition: Totale Differenzierbarkeit in $\\mathbb{R}^n$",
    math: "$$ f(\\mathbf{x}_* + \\mathbf{h}) = f(\\mathbf{x}_*) + Df(\\mathbf{x}_*) \\cdot \\mathbf{h} + o(\\|\\mathbf{h}\\|) $$",
    text: "Eine Funktion $f: \\mathbb{R}^n \\to \\mathbb{R}$ ist total differenzierbar, wenn eine lineare Abbildung $Df$ existiert, die den Funktionswert lokal perfekt approximiert. Die Existenz aller partiellen Ableitungen allein reicht NICHT aus!"
  }
};
