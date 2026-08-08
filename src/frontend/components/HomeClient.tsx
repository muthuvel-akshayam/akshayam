'use client';

import { useState } from 'react';
import ProfileWizard from './profile-wizard/ProfileWizard';
import { useLanguage } from '@/frontend/context/LanguageContext';
import { loginUser } from '@/backend/actions/auth';
import { 
  Phone, MapPin, Heart, Shield, Compass, Users, Star, 
  CheckCircle, Sparkles, UserPlus, ArrowRight, Home as HomeIcon, 
  Info, Briefcase, Mail, ChevronRight, Lock, LogIn
} from 'lucide-react';

export default function HomeClient() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await loginUser(loginMobile, loginPassword);
      if (res.success) {
        window.location.href = '/dashboard';
      } else {
        setLoginError(res.error || (language === 'TA' ? 'தவறான மொபைல் எண் அல்லது கடவுச்சொல்' : 'Invalid login credentials'));
      }
    } catch (err) {
      setLoginError(language === 'TA' ? 'உள்நுழைவதில் பிழை. மீண்டும் முயற்சிக்கவும்.' : 'Error logging in. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const servicesTa = [
    { title: 'ஜாதகம் பதிவு', desc: 'உங்கள் ஜாதகத்தை பாதுகாப்பாகவும் துல்லியமாகவும் பதிவு செய்தல்.' },
    { title: 'வாழை மரம்', desc: 'திருமண நிகழ்ச்சிகளுக்கான சிறந்த அலங்கார வாழை மரங்கள்.' },
    { title: 'ஐயர்', desc: 'முறைப்படி திருமண சடங்குகளை நடத்தும் அனுபவமிக்க புரோகிதர்கள்.' },
    { title: 'மாங்கல்ய வாத்தியம்', desc: 'மங்களகரமான நாதஸ்வரம் மற்றும் மேள தாளங்கள்.' },
    { title: 'சீர்வரிசைத் தட்டு', desc: 'அழகான மற்றும் பாரம்பரிய சீர்வரிசை தட்டுகள் அலங்காரம்.' },
    { title: 'சமையல் கேட்டரிங்', desc: 'சுவையான மற்றும் தரமான கொங்கு பாரம்பரிய சமையல்.' },
    { title: 'காய்கறி, காளான்', desc: 'திருமண விருந்துக்கான புதிய மற்றும் தரமான காய்கறிகள்.' },
    { title: 'பால், தயிர், நெய்', desc: 'சுத்தமான பண்ணை பால் மற்றும் நெய் விநியோகம்.' },
    { title: 'பால்கோவா, பன்னீர்', desc: 'விருந்துக்கு தேவையான உயர்தர இனிப்புகள் மற்றும் பன்னீர்.' },
    { title: 'டெக்கரேஷன்', desc: 'நவீன மற்றும் பாரம்பரிய மேடை அலங்காரங்கள்.' },
    { title: 'போட்டோ & வீடியோ', desc: 'உங்கள் திருமண நினைவுகளை அழியாப் படங்களாக்கும் நிபுணர்கள்.' },
    { title: 'கரும்பு ஜூஸ் மற்றும் பல', desc: 'விருந்தினர்களை உபசரிக்க சிறப்பு பானங்கள் மற்றும் தின்பண்டங்கள்.' },
  ];

  const servicesEn = [
    { title: 'Horoscope Registration', desc: 'Accurate and secure registration of horoscopes for matchmaking.' },
    { title: 'Banana Tree Decor', desc: 'Traditional auspicious banana tree arrangements for weddings.' },
    { title: 'Priest / Iyer', desc: 'Experienced Vedic priests to conduct traditional rituals.' },
    { title: 'Mangalya Music', desc: 'Auspicious Nadaswaram and Thavil artists for wedding ceremonies.' },
    { title: 'Seer Varisai Plates', desc: 'Artistic and traditional gift plate decorations for the bride & groom.' },
    { title: 'Catering Services', desc: 'Authentic Kongu style hygienic and delicious feast preparation.' },
    { title: 'Fresh Vegetables', desc: 'Supply of farm-fresh vegetables and mushrooms for wedding feasts.' },
    { title: 'Milk, Curd & Ghee', desc: 'Pure dairy supplies for authentic cooking and sweets.' },
    { title: 'Sweets & Paneer', desc: 'Premium quality Palkova, Paneer, and traditional desserts.' },
    { title: 'Stage Decoration', desc: 'Grand traditional and contemporary wedding stage floral decors.' },
    { title: 'Photo & Videography', desc: 'Expert candid photographers to capture timeless wedding memories.' },
    { title: 'Welcome Drinks & Stalls', desc: 'Special sugarcane juice, ice cream, and paan counters for guests.' },
  ];

  const services = language === 'TA' ? servicesTa : servicesEn;

  if (showRegister) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/15 py-4 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setShowRegister(false)}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary-light transition-all shadow-md hover:shadow-lg hover:-translate-x-0.5"
            >
              ← {language === 'TA' ? 'முகப்புக்கு திரும்பு' : 'Back to Home'}
            </button>
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-serif font-serif font-extrabold text-primary">
                {language === 'TA' ? 'அக்‌ஷயம் திருமணத் தகவல் மையம்' : 'Akshayam Matrimony'}
              </h1>
              <p className="text-xs text-accent font-bold mt-0.5">
                {language === 'TA' ? 'ஜாதகம் முதல் பந்தி வரை' : 'Horoscope to Wedding Feast'}
              </p>
            </div>
            <button
              onClick={toggleLanguage}
              className="relative inline-flex h-8 w-16 items-center rounded-full bg-primary focus:outline-none transition-colors shadow-inner"
              title="Translate English/Tamil"
            >
              <span className="absolute left-2 text-[10px] font-bold text-white z-0">EN</span>
              <span className="absolute right-2 text-[10px] font-bold text-white z-0">TA</span>
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md z-10 ${language === 'TA' ? 'translate-x-9' : 'translate-x-1'}`}></span>
            </button>
          </div>
        </header>
        <div className="flex-1">
          <ProfileWizard language={language} hideHeader={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-900 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 transition-all duration-300 bg-background/95 backdrop-blur-md pt-4 pb-3 shadow-sm border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <a href="#home" className="flex flex-col items-start md:items-center">
            <span className="text-2xl md:text-3xl font-serif font-serif font-extrabold text-primary tracking-tight drop-shadow-sm">
              அக்‌ஷயம்
            </span>
            <span className="text-[11px] md:text-xs text-accent font-bold tracking-wide mt-[-2px]">
              {language === 'TA' ? 'ஜாதகம் முதல் பந்தி வரை' : 'Horoscope to Wedding Feast'}
            </span>
          </a>

          <div className="hidden md:flex items-center space-x-8 text-base font-bold text-gray-800">
            <a href="#home" className="hover:text-primary transition-colors">{language === 'TA' ? 'முகப்பு' : 'Home'}</a>
            <a href="#about" className="hover:text-primary transition-colors">{language === 'TA' ? 'எங்களை பற்றி' : 'About Us'}</a>
            <a href="#services" className="hover:text-primary transition-colors">{language === 'TA' ? 'சேவைகள்' : 'Services'}</a>
            <a href="#contact" className="hover:text-primary transition-colors">{language === 'TA' ? 'தொடர்புக்கு' : 'Contact'}</a>
            
            <button
              onClick={toggleLanguage}
              className="relative inline-flex h-8 w-16 items-center rounded-full bg-primary focus:outline-none transition-colors shadow-inner"
              title="Translate English/Tamil"
            >
              <span className="absolute left-2 text-[10px] font-bold text-white z-0">EN</span>
              <span className="absolute right-2 text-[10px] font-bold text-white z-0">TA</span>
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md z-10 ${language === 'TA' ? 'translate-x-9' : 'translate-x-1'}`}></span>
            </button>

            {/* LOGIN BUTTON IN NAVBAR */}
            <button
              onClick={() => { setShowLogin(true); setLoginError(''); }}
              className="bg-white hover:bg-gray-100 text-primary px-6 py-2.5 rounded-full font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 border border-primary/30"
            >
              <LogIn className="w-4 h-4" />
              {language === 'TA' ? 'உள்நுழைக' : 'Login'}
            </button>

            {/* REGISTER BUTTON IN NAVBAR */}
            <button
              onClick={() => setShowRegister(true)}
              className="bg-primary hover:bg-primary-light text-white px-7 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 border-2 border-accent/50"
            >
              <UserPlus className="w-4 h-4 text-accent" />
              {language === 'TA' ? 'இலவச பதிவு' : 'Register Now'}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-primary focus:outline-none transition-colors shadow-inner"
            >
              <span className="absolute left-1.5 text-[9px] font-bold text-white z-0">EN</span>
              <span className="absolute right-1.5 text-[9px] font-bold text-white z-0">TA</span>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md z-10 ${language === 'TA' ? 'translate-x-8' : 'translate-x-1'}`}></span>
            </button>
            <button
              onClick={() => { setShowLogin(true); setLoginError(''); }}
              className="bg-white text-primary px-3 py-1.5 rounded-full font-bold text-xs shadow-sm flex items-center gap-1 border border-primary/30"
            >
              {language === 'TA' ? 'உள்நுழைக' : 'Login'}
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="bg-primary text-white px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md flex items-center gap-1 border border-accent"
            >
              <UserPlus className="w-3.5 h-3.5 text-accent" />
              {language === 'TA' ? 'பதிவு' : 'Register'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative w-full min-h-[85vh] flex items-center justify-center py-16 px-6 overflow-hidden bg-gradient-to-b from-[var(--color-background)] via-[var(--color-background)]/60 to-[var(--color-background)]">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs md:text-sm mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-accent" />
            {language === 'TA' ? '100% நம்பகமான கொங்கு திருமணத் தகவல் சேவை' : '100% Trusted Kongu Matrimonial Service'}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-serif font-extrabold text-primary mb-6 leading-tight drop-shadow-sm font-serif">
            {language === 'TA' ? (
              <>
                அக்‌ஷயம் <br className="hidden sm:inline" />
                <span className="text-gray-900">திருமணத் தகவல் மையம்</span>
              </>
            ) : (
              <>
                Akshayam <br className="hidden sm:inline" />
                <span className="text-gray-900">Matrimony</span>
              </>
            )}
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-accent mb-6 tracking-wide font-serif">
            {language === 'TA' 
              ? '"உங்கள் இல்லத்தின் இனிய உறவுக்கு நம்பிக்கையான துணை"' 
              : '"A Trusted Companion for Your Family\'s Sweetest Relationships"'}
          </p>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-10 max-w-2xl font-medium leading-relaxed">
            {language === 'TA'
              ? 'பல ஆண்டுகளாக நம்பிக்கையுடன் செயல்பட்டு வரும் திருமணத் தகவல் மையம். குடும்ப மதிப்புகளையும், தனியுரிமையையும் முன்னிலைப்படுத்தி சிறந்த வாழ்க்கைத்துணையை இணைத்து வருகிறோம்.'
              : 'Operating with trust and excellence for over a decade. We connect matching souls while upholding family values, tradition, and total privacy protection.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            {/* HERO REGISTER BUTTON */}
            <button
              onClick={() => setShowRegister(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-full font-extrabold text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 border-2 border-accent group"
            >
              <UserPlus className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
              {language === 'TA' ? 'இலவச பதிவு செய்க' : 'Register Your Profile'}
              <ArrowRight className="w-5 h-5 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="tel:9677613716"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-primary border-2 border-primary px-8 py-5 rounded-full font-bold text-lg transition-all shadow-md hover:shadow-lg"
            >
              <Phone className="w-5 h-5 text-primary" />
              {language === 'TA' ? 'இப்போது அழைக்க' : 'Call Now'}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-primary text-lg md:text-xl font-bold">
            <a href="tel:9677613716" className="hover:text-accent transition-colors flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-primary/10">
              <Phone className="w-4 h-4 text-accent" /> 96776 13716
            </a>
            <span className="text-accent opacity-50 hidden sm:inline">|</span>
            <a href="tel:9345289217" className="hover:text-accent transition-colors flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-primary/10">
              <Phone className="w-4 h-4 text-accent" /> 93452 89217
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60"></div>
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-serif font-extrabold text-primary mb-4">
              {language === 'TA' ? 'எங்களை பற்றி' : 'About Us'}
            </h2>
            <div className="w-24 h-1.5 bg-accent mx-auto mb-10 rounded-full"></div>
            
            <div className="bg-background p-8 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-primary/10 text-left md:text-center">
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6 font-medium">
                <strong className="text-primary font-bold">
                  {language === 'TA' ? 'அக்‌ஷயம் திருமணத் தகவல் மையம்' : 'Akshayam Matrimony'}
                </strong> {language === 'TA'
                  ? 'என்பது நம்பகமான திருமணத் தகவல் சேவையாகும். மணமகன் மற்றும் மணமகளின் விருப்பங்களுக்கு ஏற்ப பொருத்தமான வாழ்க்கைத்துணையை அறிமுகப்படுத்துவது எங்கள் நோக்கம்.'
                  : 'is a dedicated and trusted matrimonial information center. Our mission is to introduce the most compatible life partners tailored to the wishes of brides, grooms, and their families.'}
              </p>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
                {language === 'TA'
                  ? 'கடந்த 10 ஆண்டுகளாக திருமணத் தகவல் சேவையில் ஈடுபட்டு, எங்கள் பகுதியில் 200 க்கும் மேற்பட்ட திருமணங்களை வெற்றிகரமாக நடத்தி வைத்துள்ளோம். நேர்மை, நம்பிக்கை, தனியுரிமை மற்றும் குடும்ப மதிப்புகளை அடிப்படையாகக் கொண்டு பல குடும்பங்களுக்கு வெற்றிகரமான திருமணங்களை உருவாக்கி வருகிறோம்.'
                  : 'With over a decade of dedicated service in Kongu matrimonial matchmaking, we have successfully united over 200+ couples in joyful matrimony. Guided by honesty, trust, strict privacy, and traditional values, we turn matchmaking into a blessed family journey.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background relative border-y border-primary/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-serif font-extrabold text-primary mb-4">
              {language === 'TA' ? 'எங்கள் சேவைகள்' : 'Our Services'}
            </h2>
            <div className="w-24 h-1.5 bg-accent mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-700 max-w-xl mx-auto font-medium">
              {language === 'TA' ? 'திருமணம் தொடர்பான அனைத்து தேவைகளுக்கும் ஒரே இடம்' : 'A complete one-stop destination for all wedding ceremony needs'}
            </p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-primary/15">
            <div className="bg-primary py-5 px-6 text-center shadow-md">
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                {language === 'TA' ? 'ஜாதகம் முதல் பந்தி வரை' : 'From Horoscope Matching to Wedding Feast'}
              </h3>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((srv, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-4 p-5 rounded-2xl bg-background/60 hover:bg-background border border-primary/5 hover:border-accent transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Star className="w-5 h-5 text-accent fill-[var(--color-accent)] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                        {srv.title}
                      </h4>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary py-4 px-6 text-center shadow-inner">
              <p className="text-lg md:text-xl font-bold text-white tracking-wide">
                {language === 'TA' ? 'அனைத்தும் சிறந்த முறையில் செய்து தருகிறோம்' : 'We arrange everything with paramount quality and care'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-serif font-extrabold text-primary mb-4">
              {language === 'TA' ? 'ஏன் எங்களை தேர்வு செய்ய வேண்டும்?' : 'Why Choose Akshayam?'}
            </h2>
            <div className="w-24 h-1.5 bg-accent mx-auto mb-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl border border-primary/10 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{language === 'TA' ? 'நம்பகமான சேவை' : 'Trusted Service'}</h3>
              <p className="text-gray-600 font-medium">{language === 'TA' ? 'உங்கள் நம்பிக்கையை மதிக்கும் உன்னதமான சேவை.' : 'Dedicated matchmaking honoring your family’s highest trust.'}</p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-primary/10 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                <Lock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{language === 'TA' ? 'தனியுரிமை பாதுகாப்பு' : '100% Privacy Protection'}</h3>
              <p className="text-gray-600 font-medium">{language === 'TA' ? 'உங்கள் தகவல்கள் அனைத்தும் 100% பாதுகாப்பாக கையாளப்படும்.' : 'Your personal information is confidential and shared only with consent.'}</p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-primary/10 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                <Compass className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{language === 'TA' ? 'அனுபவமிக்க வழிகாட்டுதல்' : 'Experienced Guidance'}</h3>
              <p className="text-gray-600 font-medium">{language === 'TA' ? 'சரியான துணையை தேர்ந்தெடுக்க சிறந்த ஆலோசனை.' : 'Expert counseling to help you choose the ideal life partner.'}</p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-primary/10 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{language === 'TA' ? 'தனிப்பட்ட ஆலோசனை' : 'Personalized Attention'}</h3>
              <p className="text-gray-600 font-medium">{language === 'TA' ? 'உங்கள் தேவைகளை புரிந்து கொண்டு தனிப்பட்ட கவனம்.' : 'We understand your specific preferences and give individual care.'}</p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-primary/10 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group md:col-span-2 lg:col-span-2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{language === 'TA' ? 'குடும்ப மதிப்புகளுக்கு முன்னுரிமை' : 'Priority to Family Values'}</h3>
              <p className="text-gray-600 font-medium">{language === 'TA' ? 'பாரம்பரியம் மற்றும் குடும்ப மதிப்புகளுக்கு சிறப்பு முக்கியத்துவம்.' : 'We deeply respect Kongu traditions, astrology, and cultural heritage in every match.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA REGISTER SECTION */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary)] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--color-background)_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 font-serif text-white">
            {language === 'TA' ? 'உங்கள் புதிய வாழ்க்கைப் பயணம் இன்றே தொடரட்டும்!' : 'Start Your Beautiful Journey Today!'}
          </h2>
          <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto font-medium">
            {language === 'TA'
              ? 'இலவசமாக பதிவு செய்து உங்கள் குடும்பத்திற்கான பொருத்தமான வாழ்க்கைத்துணையை தேர்ந்தெடுக்கவும்.'
              : 'Register for free and explore verified, high-compatibility profiles from respected families.'}
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-accent hover:bg-[#c29d2b] text-[#2a1414] px-12 py-5 rounded-full font-extrabold text-xl transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3 border-2 border-white/20"
          >
            <UserPlus className="w-6 h-6 text-[#2a1414]" />
            {language === 'TA' ? 'இப்போதே பதிவு செய்யுங்கள்' : 'Register Now - Free'}
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-serif font-extrabold text-primary mb-4">
              {language === 'TA' ? 'தொடர்புக்கு' : 'Contact Us'}
            </h2>
            <div className="w-24 h-1.5 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-primary/5 border border-primary/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">{language === 'TA' ? 'தொலைபேசி எண்கள்' : 'Phone Numbers'}</h3>
                </div>
              </div>
              <div className="space-y-6">
                <a href="tel:9677613716" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-background transition-colors group border border-gray-100">
                  <span className="text-xl font-bold text-gray-800">96776 13716</span>
                  <Phone className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
                </a>
                <a href="tel:9345289217" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-background transition-colors group border border-gray-100">
                  <span className="text-xl font-bold text-gray-800">93452 89217</span>
                  <Phone className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
                </a>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-primary/5 border border-primary/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">{language === 'TA' ? 'முகவரி' : 'Address'}</h3>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-100">
                <address className="not-italic text-lg font-semibold text-gray-800 leading-relaxed text-center">
                  {language === 'TA' ? (
                    <>
                      மலைக்கோயில்,<br />
                      மங்கலம் ரோடு,<br />
                      திருப்பூர் - 641 663
                    </>
                  ) : (
                    <>
                      Malaikovil,<br />
                      Mangalam Road,<br />
                      Tiruppur - 641 663
                    </>
                  )}
                </address>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-accent/40 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2a1414] text-white py-12 relative overflow-hidden mt-auto">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-2xl font-bold mb-4 text-accent font-serif">
            {language === 'TA' ? 'அக்‌ஷயம் திருமணத் தகவல் மையம்' : 'Akshayam Matrimony'}
          </h3>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto italic">
            {language === 'TA'
              ? '"நம்பிக்கையுடன் உறவுகளை இணைக்கும் உங்கள் குடும்பத்தின் முதல் தேர்வு."'
              : '"The first choice of families for uniting lives with trust and blessing."'}
          </p>
          <div className="w-full h-px bg-white/10 my-8"></div>
          <p className="text-gray-400 text-sm">© 2026 Akshayam Matrimony. {language === 'TA' ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All rights reserved.'}</p>
        </div>
      </footer>

      {/* Floating Call CTA */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <a
          href="tel:9677613716"
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-light hover:scale-110 transition-all border-2 border-accent"
          title="Call Now"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => { setShowLogin(false); setLoginError(''); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-background border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-serif font-extrabold text-primary font-serif">
                {language === 'TA' ? 'உள்நுழைக' : 'Login to Akshayam'}
              </h3>
              <p className="text-xs text-gray-500 font-bold mt-1">
                {language === 'TA' ? 'உங்கள் மொபைல் எண் மற்றும் கடவுச்சொல்லை உள்ளிடவும்' : 'Enter your registered mobile number & password'}
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  {language === 'TA' ? 'மொபைல் எண்' : 'Mobile Number'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-gray-400 text-sm font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    value={loginMobile}
                    onChange={(e) => setLoginMobile(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 font-bold text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  {language === 'TA' ? 'கடவுச்சொல்' : 'Password'}
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 font-bold text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-sm flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <span>{language === 'TA' ? 'உள்நுழைகிறது...' : 'Logging in...'}</span>
                ) : (
                  <>
                    <span>{language === 'TA' ? 'உள்நுழைக' : 'Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                {language === 'TA' ? 'கணக்கு இல்லையா?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setShowLogin(false); setShowRegister(true); }}
                  className="text-primary font-bold hover:underline"
                >
                  {language === 'TA' ? 'இப்போதே பதிவு செய்யவும்' : 'Register Now'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
