import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const RecommendationSection = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/features/pc9.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full border-4 border-white flex flex-col items-center justify-center text-white">
                <div className="text-sm uppercase">HƠN</div>
                <div className="text-6xl font-bold">1250</div>
                <div className="text-sm uppercase text-[#ff8460]">Gia Đình Hạnh Phúc</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 text-white">
            <h2 className="text-4xl font-bold mb-4">Mọi Người Đề Xuất Chúng Tôi</h2>
            <div className="text-[#ff8460] font-medium mb-4">TẠI SAO CHỌN CHÚNG TÔI</div>
            <p className="mb-8">
              Chúng tôi cung cấp sự chăm sóc và quan tâm cá nhân hóa cho mỗi khách hàng trong hành trình làm cha mẹ của họ. 
              Chúng tôi cung cấp xét nghiệm toàn diện để xác định nguyên nhân vô sinh ở nam và nữ, và chúng tôi 
              chuyên về IUI và IVF.
            </p>
            <Button 
              onClick={() => navigate('/contacts')}
              className="bg-[#ff8460] hover:bg-[#ff6b40] text-white border-none rounded py-3 px-8"
            >
              Liên Hệ Với Chúng Tôi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationSection; 