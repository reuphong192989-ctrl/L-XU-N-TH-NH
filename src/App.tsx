/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Leaf, 
  Zap, 
  Heart, 
  Brain, 
  Moon, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MapPin, 
  Package,
  ChevronDown,
  Menu,
  X,
  Star,
  ExternalLink
} from 'lucide-react';

// --- Sub-components ---

const SectionHeading = ({ children, subtitle, light = false }: { children: React.ReactNode, subtitle?: string, light?: boolean }) => (
  <div className="text-center mb-16">
    {subtitle && (
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 block ${light ? 'text-brand-primary/90' : 'text-brand-primary'}`}
      >
        {subtitle}
      </motion.span>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`text-3xl md:text-5xl font-bold font-serif leading-tight ${light ? 'text-white' : 'text-brand-secondary'}`}
    >
      {children}
    </motion.h2>
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 60 }}
      className={`h-1 mx-auto mt-6 rounded-full ${light ? 'bg-brand-primary' : 'bg-brand-primary/50'}`} 
    />
  </div>
);

const BenefitCard = ({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-8 rounded-2xl flex flex-col items-center text-center gap-4 group"
  >
    <div className="p-4 bg-brand-primary/10 rounded-full text-brand-primary group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-brand-secondary font-serif mt-2">{title}</h3>
    <p className="text-[#1a3c34]/70 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const IngredientBadge = ({ name, mg }: { name: string, mg?: string }) => (
  <div className="bg-stone-100 px-4 py-2 rounded-full border border-stone-200 flex items-center gap-2">
    <CheckCircle2 size={16} className="text-brand-secondary" />
    <span className="font-semibold text-stone-800 text-sm md:text-base">{name}</span>
    {mg && <span className="text-stone-500 text-xs italic">{mg}</span>}
  </div>
);

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', message: undefined });
    
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone') as string;
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    
    // Validate empty fields (although HTML 'required' handles this, it's good to have it here)
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setFormStatus({ type: 'error', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' });
      return;
    }

    // Validate phone number format (Vietnamese 10 digits starting with 03, 05, 07, 08, 09)
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      setFormStatus({ type: 'error', message: 'Số điện thoại không hợp lệ. Vui lòng nhập 10 số (VD: 0912345678).' });
      return;
    }

    const data = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      quantity: formData.get('quantity'),
      note: formData.get('note'),
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (result.success) {
        setFormStatus({ type: 'success', message: result.message });
      } else {
        setFormStatus({ type: 'error', message: result.error });
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: "Lỗi kết nối máy chủ. Vui lòng thử lại!" });
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 geometric-bg pointer-events-none z-0" />
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">C</div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight uppercase leading-none ${isScrolled ? 'text-brand-secondary' : 'text-white'}`}>Sâm Canada CND</h1>
              <p className={`text-[10px] uppercase tracking-[2px] opacity-70 ${isScrolled ? 'text-stone-500' : 'text-white/70'}`}>Premium Supplement</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Thành phần', 'Công dụng', 'Đối tượng', 'Hướng dẫn'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className={`font-medium transition-colors hover:text-brand-primary ${isScrolled ? 'text-stone-700' : 'text-white/90'}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <a 
            href="#order"
            className="hidden md:block bg-brand-secondary text-white px-6 py-2 rounded-full font-bold hover:bg-brand-secondary/90 transition-all shadow-lg active:scale-95"
          >
            Mua Ngay
          </a>

          <button className="md:hidden text-brand-secondary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} className={isScrolled ? 'text-stone-700' : 'text-white'} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white md:hidden pt-24 px-6"
          >
            <nav className="flex flex-col gap-6 text-center">
              {['Thành phần', 'Công dụng', 'Đối tượng', 'Hướng dẫn'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-2xl font-bold text-stone-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a 
                href="#order"
                className="bg-brand-secondary text-white py-4 rounded-xl text-xl font-bold shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Mua Ngay
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src=""
            className="w-full h-full object-cover scale-105"
            alt="Background"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <span className="inline-block bg-brand-primary text-stone-900 px-4 py-1 rounded-full font-bold mb-6 text-sm uppercase tracking-wider">
              Dòng Sâm Thượng Hạng Từ Canada
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Bồi bổ sức khỏe,<br/> 
              <span className="font-light italic text-brand-primary">Nâng tầm đề kháng</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-100 mb-8 max-w-lg leading-relaxed">
              Sự kết hợp hoàn hảo giữa Nhân Sâm Canada & Táo Đỏ giúp bồi bổ cơ thể, tăng cường sinh lực và bảo vệ hệ thần kinh mỗi ngày.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#order" className="bg-brand-primary text-stone-900 text-center px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                Đặt Hàng Ngay
              </a>
              <a href="#công-dụng" className="bg-white/10 backdrop-blur-sm text-center text-white border border-white/30 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                Tìm Hiểu Thêm
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-stone-300">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-stone-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">9.500+ Khách hàng tin dùng</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-primary/20 blur-3xl rounded-full animate-pulse" />
            <img 
              src="https://i.ibb.co/V0b7SGGR/1778747381429-2015678084405579452-6260541727792012196-f77e09d71b069feeba2f5cb25b47ad0e.jpg" 
              className="relative z-10 w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              alt="Hộp Sâm CND"
              referrerPolicy="no-referrer"
            />
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 right-0 z-20 bg-white p-4 rounded-2xl shadow-xl border border-brand-primary"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-brand-secondary" />
                <div>
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-tighter">Chứng nhận</p>
                  <p className="text-sm font-bold text-stone-800 italic">GMP & ISO 22000</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="text-white" size={32} />
        </div>
      </section>

      {/* Ingredients */}
      <section id="thành-phần" className="py-24 bg-white/50 backdrop-blur-sm relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading subtitle="Chiết xuất tự nhiên" >Công Thức Độc Bản</SectionHeading>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Sâm Canada CND GINSENG được bào chế từ những củ nhân sâm Canada đạt chuẩn 6 năm tuổi, kết hợp cùng Táo đỏ hảo hạng và các vi chất thiết yếu. Một sự kết hợp tinh túy giúp tối ưu hóa khả năng hấp thụ và mang lại hiệu quả vượt trội.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <IngredientBadge name="Cao bột nhân sâm Canada" mg="350 mg" />
                <IngredientBadge name="Cao táo đỏ" mg="350 mg" />
                <IngredientBadge name="Vitamin C" />
                <IngredientBadge name="Vitamin D" />
                <IngredientBadge name="Kẽm (Zinc)" />
                <IngredientBadge name="Chất xơ tự nhiên" />
              </div>

              <div className="mt-10 p-6 bg-stone-50 rounded-2xl border-l-4 border-brand-primary">
                <p className="italic text-stone-700">
                  "Nhân sâm Canada có tính mát, giúp bồi bổ mà không lo gây nóng trong, phù hợp cho cả người cao huyết áp nếu dùng đúng liều lượng."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                 <img src="https://i.ibb.co/rKCdmw8h/1778747380896-2015678084405579452-6260541727792012196-acdb19ba70ebff1c9a6350703596e937.jpg" alt="Root" className="rounded-2xl shadow-lg w-full h-64 object-cover" referrerPolicy="no-referrer" />
                 <img src="https://i.ibb.co/7dGJZx7h/t3-768x768.png" alt="Dates" className="rounded-2xl shadow-lg w-full h-40 object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="pt-8">
                 <img src="https://i.ibb.co/cSqYyS4c/t4-768x768.png" alt="Tea" className="rounded-2xl shadow-lg w-full h-96 object-cover" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="công-dụng" className="py-24 bg-[#f9f7f2]/50">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Tại sao nên chọn CND Ginseng">Giá Trị Sức Khỏe Toàn Diện</SectionHeading>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard 
              icon={Zap} 
              title="Phục Hồi Năng Lượng" 
              description="Bồi bổ sức khỏe, phục hồi nhanh chóng sau khi ốm nặng, làm việc quá sức và mệt mỏi mất tập trung."
              delay={0.1}
            />
            <BenefitCard 
              icon={Brain} 
              title="Minh Mẫn Trí Óc" 
              description="Tăng lưu lượng máu lên não, cải thiện trí nhớ, bảo vệ hệ thần kinh và giảm stress lâu ngày."
              delay={0.2}
            />
            <BenefitCard 
              icon={Heart} 
              title="Bảo Vệ Tim Mạch" 
              description="Cải thiện sức khỏe tim mạch, ức chế cục máu đông, gia tăng lực co bóp cơ tim và cân bằng huyết áp."
              delay={0.3}
            />
            <BenefitCard 
              icon={ShieldCheck} 
              title="Sức Đề Kháng Vượt Trội" 
              description="Kháng viêm, giảm đau, chống lão hóa, ngăn chặn gốc tự do và hỗ trợ làm giảm tế bào ung thư."
              delay={0.4}
            />
            <BenefitCard 
              icon={Star} 
              title="Sức Khỏe Sinh Sản" 
              description="Cải thiện hệ thống nội tiết, chống rối loạn cương dương và gia tăng sức chịu đựng cho nam & nữ."
              delay={0.5}
            />
            <BenefitCard 
              icon={Leaf} 
              title="Phòng Ngừa Tiểu Đường" 
              description="Hỗ trợ ngăn ngừa biến chứng bệnh tiểu đường hiệu quả như mờ mắt, tê bì chân tay."
              delay={0.6}
            />
            <BenefitCard 
              icon={Package} 
              title="Tuần Hoàn Máu" 
              description="Chữa xơ vữa động mạch, hỗ trợ giảm Lipid máu cao và tình trạng gan nhiễm mỡ."
              delay={0.7}
            />
            <BenefitCard 
              icon={Moon} 
              title="Giấc Ngủ Ngon" 
              description="Giúp an thần, cải thiện giấc ngủ sâu hơn cho người thường xuyên mất ngủ hoặc căng thẳng."
              delay={0.8}
            />
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section id="đối-tượng" className="py-24 bg-brand-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading subtitle="Dành cho ai?" light>Đối Tượng Sử Dụng</SectionHeading>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-8 bg-brand-primary rounded-full" />
                Người Lớn Tuổi
              </h3>
              <ul className="space-y-3 text-stone-200">
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Sức khỏe kém, đề kháng yếu</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Mất ngủ, tiểu đêm nhiều</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Đau lưng, mỏi gối</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-8 bg-brand-primary rounded-full" />
                Giới Trí Thức & Văn Phòng
              </h3>
              <ul className="space-y-3 text-stone-200">
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Làm việc cường độ cao</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Thường xuyên bị stress</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Mệt mỏi, kém tập trung</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-8 bg-brand-primary rounded-full" />
                Hỗ Trợ Điều Trị
              </h3>
              <ul className="space-y-3 text-stone-200">
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Bệnh mãn tính: Tim mạch, huyết áp</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Sinh lý nam & tiền mãn kinh nữ</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-brand-primary" /> Người dùng nhiều bia rượu, thuốc lá</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Usage & Specs */}
      <section id="hướng-dẫn" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
                <h3 className="text-3xl font-bold mb-6 italic">Cách Sử Dụng Đạt Hiệu Quả</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center shrink-0 text-brand-secondary font-bold text-xl border border-brand-primary">1</div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">Pha Chế</h4>
                      <p className="text-stone-600">Pha 1 gói với 100ml - 200ml nước (ấm hoặc nguội). Tránh dùng nước quá nóng (sôi) để bảo vệ Vitamin.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center shrink-0 text-brand-secondary font-bold text-xl border border-brand-primary">2</div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">Liều Lượng</h4>
                      <p className="text-stone-600">Sử dụng từ 1 đến 3 gói/ngày tùy theo nhu cầu và thể trạng.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center shrink-0 text-brand-secondary font-bold text-xl border border-brand-primary">3</div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">Thời Gian</h4>
                      <p className="text-stone-600">Uống trong ngày trước 6 giờ tối, tốt nhất là uống khi no để cơ thể hấp thu tốt nhất.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="p-8 bg-brand-primary/5 rounded-3xl border-2 border-dashed border-brand-primary/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="text-brand-secondary" />
                  Thông Tin Sản Phẩm
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div className="text-stone-500">Quy cách:</div> <div className="text-stone-800">20 gói/hộp (3g/gói)</div>
                  <div className="text-stone-500">Hạn sử dụng:</div> <div className="text-stone-800">36 tháng</div>
                  <div className="text-stone-500">Bảo quản:</div> <div className="text-stone-800">Nơi khô ráo, thoáng mát</div>
                  <div className="text-stone-500">Thương hiệu:</div> <div className="text-brand-secondary font-bold italic underline">Sâm Bắc Mỹ CND</div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} className="bg-stone-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent pointer-events-none" />
                 <h3 className="text-2xl font-bold mb-6 relative z-10 flex items-center gap-3">
                   <ShieldCheck className="text-brand-primary" />
                   Lưu Ý Quan Trọng
                 </h3>
                 <ul className="space-y-4 text-stone-300 relative z-10 text-sm">
                   <li className="pb-4 border-b border-white/10 uppercase font-black italic tracking-widest text-brand-primary">Sản phẩm này không phải là thuốc, không thay thế thuốc chữa bệnh</li>
                   <li>• Không dùng cho người mẫn cảm với bất kỳ thành phần nào.</li>
                   <li>• Không dùng cho phụ nữ có thai và đang cho con bú.</li>
                   <li>• Không dùng cho trẻ em dưới 10 tuổi.</li>
                   <li>• Người điều trị bệnh mãn tính nên tham khảo ý kiến bác sĩ.</li>
                 </ul>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-4">
                 <img src="https://i.ibb.co/cSqYyS4c/t4-768x768.png" alt="Box 1" className="rounded-2xl w-full h-full object-cover" referrerPolicy="no-referrer" />
                 <img src="https://i.ibb.co/qVgTK72/t5-768x768.png" alt="Box 2" className="rounded-2xl w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="py-24 bg-stone-100 flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] shadow-2xl overflow-hidden grid md:grid-cols-5 border border-stone-200"
          >
            <div className="md:col-span-2 bg-brand-secondary p-8 md:p-12 text-white flex flex-col justify-between">
              <div>
                 <h3 className="text-3xl md:text-4xl font-bold mb-6">Đăng Ký Tư Vấn & Đặt Hàng</h3>
                 <p className="text-stone-200 mb-8 leading-relaxed">
                   Để lại thông tin chính xác, chuyên gia của chúng tôi sẽ liên hệ sớm nhất để hỗ trợ bạn!
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Phone className="text-brand-primary" />
                      <span className="font-bold">Hotline: 1900 xxxx</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPin className="text-brand-primary" />
                      <span className="text-sm">528 Xô Viết Nghệ Tĩnh, P25, Bình Thạnh, TPHCM</span>
                    </div>
                 </div>
              </div>
              
              <div className="mt-12">
                 <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" className="text-brand-primary" />)}
                 </div>
                 <p className="text-sm italic">"Chất lượng vượt mong đợi, giao hàng cực nhanh!" - Chú Nam (65t)</p>
              </div>
            </div>

            <div className="md:col-span-3 p-8 md:p-12 bg-white">
              <AnimatePresence mode="wait">
                {formStatus.type === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 size={48} />
                    </div>
                    <h4 className="text-2xl font-bold text-stone-800">Thành Công!</h4>
                    <p className="text-stone-600">{formStatus.message}</p>
                    <button 
                      onClick={() => setFormStatus({ type: 'idle' })}
                      className="text-brand-secondary font-bold hover:underline"
                    >
                      Tiếp tục đăng ký đơn khác
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmitOrder} 
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-secondary/70 mb-2">Họ và Tên <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        className="input-field"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-secondary/70 mb-2">Số Điện Thoại <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        pattern="^(0[3|5|7|8|9])[0-9]{8}$"
                        title="Vui lòng nhập 10 số (VD: 0912345678)"
                        className="input-field"
                        placeholder="09xx xxx xxx"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-secondary/70 mb-2">Địa Chỉ Nhận Hàng <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="address"
                        required
                        className="input-field"
                        placeholder="Số nhà, tên đường, phường/xã..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-secondary/70 mb-2">Số Lượng <span className="text-red-500">*</span></label>
                        <select 
                          name="quantity"
                          required
                          className="input-field cursor-pointer"
                        >
                          <option value="1">1 Hộp (20 gói)</option>
                          <option value="2">2 Hộp</option>
                          <option value="3">Mua 3 Tặng 1</option>
                          <option value="5">Mua 5 Tặng 2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-secondary/70 mb-2">Ghi Chú</label>
                        <input 
                          type="text" 
                          name="note"
                          className="input-field"
                          placeholder="Ví dụ: Giao giờ hành chính"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={formStatus.type === 'loading'}
                      className="btn-primary mt-6 w-full"
                    >
                      {formStatus.type === 'loading' ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Xác Nhận Đặt Hàng <ChevronDown className="-rotate-90 ml-1" size={18} /></>
                      )}
                    </button>
                    
                    {formStatus.type === 'error' && (
                      <p className="text-red-500 text-sm font-bold text-center">{formStatus.message}</p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">CND</div>
                <span className="text-2xl font-bold">CND GINSENG</span>
              </div>
              <p className="text-stone-400 mb-6 max-w-sm leading-relaxed">
                Chúng tôi cam kết mang đến những sản phẩm chăm sóc sức khỏe tốt nhất từ nhân sâm Canada thượng hạng, được kiểm định nghiêm ngặt về chất lượng.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-brand-primary uppercase tracking-widest">Sản Xuất Bởi</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Công Ty Cổ Phần Dược Laterre France <br/>
                Địa chỉ: Số 08A Ấp Phú Thành, Xã Phước Lý, Huyện Cần Giuộc, Tỉnh Long An, Việt Nam
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-brand-primary uppercase tracking-widest">Phân Phối Bởi</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Công Ty TNHH Sâm Bắc Mỹ CND <br/>
                Địa chỉ: 528 Xô Viết Nghệ Tĩnh, P25, Bình Thạnh, TPHCM <br/>
                Website: cndginseng.com.vn
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
            <p>© 2026 CND GINSENG. All rights reserved. Designed for Health.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Chính sách vận chuyển</a>
              <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating CTA for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <a 
          href="#order" 
          className="bg-brand-primary text-stone-900 p-4 rounded-full shadow-2xl flex items-center justify-center animate-pulse"
        >
          <Phone size={24} />
        </a>
      </div>
    </div>
  );
}
