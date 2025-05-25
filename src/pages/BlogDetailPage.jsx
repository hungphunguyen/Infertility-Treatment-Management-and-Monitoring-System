import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Typography, Row, Col, Divider, Tag, Card, Avatar, Button, Space, List } from "antd";
import { CalendarOutlined, UserOutlined, TagOutlined, ClockCircleOutlined, RightOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;

// Blog posts data
const blogPostsData = [
  {
    id: 1,
    slug: "modern-mothers-8-surprising-facts",
    title: "Những Bà Mẹ Hiện Đại: 8 Sự Thật Bất Ngờ",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc5.jpg",
    author: "TS. Sarah Johnson",
    authorImage: "/images/features/pc11.jpg",
    readTime: "8 phút đọc",
    category: "Thai Kỳ",
    tags: ["Làm Mẹ", "Thai Kỳ", "Sức Khỏe Phụ Nữ"],
    summary: "Khám phá những thay đổi hấp dẫn trong vai trò làm mẹ hiện đại và cách các bà mẹ ngày nay trải qua hành trình mang thai khác biệt so với các thế hệ trước.",
    content: [
      "Làm mẹ hiện đại đã phát triển đáng kể trong vài thập kỷ qua, với phụ nữ cân bằng giữa sự nghiệp, khát vọng cá nhân và gia đình theo những cách mới. Dưới đây là tám sự thật bất ngờ về những bà mẹ hiện đại phản ánh những thay đổi này:",
      "1. Độ tuổi trung bình của các bà mẹ lần đầu đã tăng lên trên 30 ở nhiều quốc gia phát triển, so với đầu 20 tuổi vào những năm 1970.",
      "2. Hơn 70% các bà mẹ có con dưới 18 tuổi tham gia vào lực lượng lao động, so với 47% vào năm 1975.",
      "3. Một trong năm ca sinh hiện nay là của phụ nữ trên 35 tuổi, với các phương pháp điều trị sinh sản tiên tiến khiến điều này ngày càng khả thi.",
      "4. Các nghiên cứu cho thấy con cái của các bà mẹ đi làm thường phát triển kỹ năng xã hội và thành tích học tập tốt hơn.",
      "5. Các bà mẹ hiện đại dành nhiều thời gian chất lượng hơn cho con cái mặc dù làm việc ngoài nhà nhiều hơn so với các thế hệ trước.",
      "6. Các công cụ số đã thay đổi vai trò làm mẹ, với 90% bà mẹ mới sử dụng ứng dụng để theo dõi sự phát triển của bé, lịch cho ăn và thông tin sức khỏe.",
      "7. Hỗ trợ cộng đồng ngày càng đến từ các nguồn trực tuyến, với 65% bà mẹ mới tham gia các nhóm hỗ trợ trực tuyến.",
      "8. Sở thích sinh con đã đa dạng hóa, với sự quan tâm ngày càng tăng đến các phương pháp sinh tự nhiên, hỗ trợ từ doula, và các trung tâm sinh bên cạnh các bệnh viện truyền thống."
    ],
    relatedPosts: [2, 3, 9]
  },
  {
    id: 2,
    slug: "top-7-causes-of-infertility-in-women",
    title: "7 Nguyên Nhân Hàng Đầu Gây Vô Sinh Ở Phụ Nữ",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc4.jpg",
    author: "TS. Michael Brown",
    authorImage: "/images/features/pc12.jpg",
    readTime: "10 phút đọc",
    category: "Sinh Sản",
    tags: ["Vô Sinh", "Sức Khỏe Phụ Nữ", "Sức Khỏe Sinh Sản"],
    summary: "Hiểu biết về các yếu tố phổ biến nhất góp phần gây vô sinh ở phụ nữ và cách y học hiện đại có thể giải quyết những thách thức này.",
    content: [
      "Vô sinh ảnh hưởng đến khoảng 10-15% các cặp vợ chồng, với các yếu tố từ phụ nữ chiếm khoảng một phần ba các trường hợp này. Hiểu biết về các nguyên nhân phổ biến có thể giúp phụ nữ tìm kiếm phương pháp điều trị phù hợp. Dưới đây là bảy nguyên nhân hàng đầu gây vô sinh ở phụ nữ:",
      "1. Rối loạn rụng trứng: Các vấn đề về rụng trứng chiếm khoảng 25% các trường hợp vô sinh ở phụ nữ. Các tình trạng như PCOS (Hội chứng buồng trứng đa nang), rối loạn chức năng vùng dưới đồi, suy buồng trứng sớm, và tăng prolactin huyết có thể làm gián đoạn việc phóng noãn thường xuyên.",
      "2. Tắc hoặc tổn thương ống dẫn trứng: Ống dẫn trứng bị tổn thương hoặc tắc ngăn tinh trùng tiếp cận trứng hoặc ngăn chặn đường đi của trứng đã thụ tinh đến tử cung. Điều này có thể do bệnh viêm vùng chậu, phẫu thuật trước đó hoặc lạc nội mạc tử cung.",
      "3. Lạc nội mạc tử cung: Tình trạng này xảy ra khi mô tương tự lớp nội mạc tử cung cấy ghép và phát triển ngoài tử cung, ảnh hưởng đến chức năng của buồng trứng, tử cung và ống dẫn trứng.",
      "4. Bất thường ở tử cung hoặc cổ tử cung: Các vấn đề cấu trúc như u xơ, polyp hoặc bất thường về hình dạng tử cung có thể cản trở việc cấy ghép phôi hoặc tăng nguy cơ sảy thai.",
      "5. Suy buồng trứng nguyên phát: Điều này xảy ra khi buồng trứng ngừng hoạt động bình thường trước 40 tuổi, làm giảm sản xuất estrogen và phóng noãn.",
      "6. Yếu tố liên quan đến tuổi tác: Khả năng sinh sản của phụ nữ giảm dần theo tuổi, đặc biệt sau 35 tuổi, do số lượng và chất lượng trứng giảm.",
      "7. Vô sinh không rõ nguyên nhân: Trong khoảng 10-30% các trường hợp vô sinh, các xét nghiệm sinh sản tiêu chuẩn không thể xác định nguyên nhân cụ thể."
    ],
    relatedPosts: [3, 6, 7]
  },
  {
    id: 3,
    slug: "ivf-or-ivm-which-is-right-for-you",
    title: "IVF hay IVM: Lựa Chọn Nào Phù Hợp Với Bạn?",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc6.jpg",
    author: "TS. Andrew Peterson",
    authorImage: "/images/features/pc10.jpg",
    readTime: "12 phút đọc",
    category: "Điều Trị Sinh Sản",
    tags: ["IVF", "IVM", "Điều Trị Sinh Sản", "Công Nghệ Sinh Sản"],
    summary: "So sánh toàn diện giữa Thụ tinh Trong ống nghiệm (IVF) và Trưởng thành Trong ống nghiệm (IVM) để giúp bạn hiểu phương pháp điều trị sinh sản nào phù hợp nhất với tình huống của bạn.",
    content: [
      "Khi xem xét các phương pháp điều trị sinh sản, việc hiểu sự khác biệt giữa IVF và IVM là rất quan trọng để đưa ra quyết định sáng suốt. Dưới đây là so sánh chi tiết giữa hai quy trình sinh sản quan trọng này:",
      "Thụ tinh Trong ống nghiệm (IVF) là công nghệ hỗ trợ sinh sản được biết đến và thực hiện rộng rãi nhất. Nó bao gồm kích thích buồng trứng bằng hormone để tạo ra nhiều trứng, sau đó được lấy ra và thụ tinh trong phòng thí nghiệm. Các phôi kết quả được nuôi cấy trong 3-5 ngày trước khi các phôi chất lượng tốt nhất được chuyển vào tử cung.",
      "Trưởng thành Trong ống nghiệm (IVM) là một kỹ thuật mới hơn, nơi các trứng chưa trưởng thành được lấy ra từ buồng trứng với kích thích hormone tối thiểu hoặc không có. Những trứng này sau đó được trưởng thành trong phòng thí nghiệm trước khi thụ tinh. Phương pháp này yêu cầu ít thuốc hơn và ít giám sát hơn.",
      "Những khác biệt chính cần xem xét khi lựa chọn giữa IVF và IVM:",
      "1. Kích thích Hormone: IVF thường yêu cầu tiêm hormone trong 8-12 ngày để kích thích sản xuất trứng, trong khi IVM yêu cầu kích thích tối thiểu hoặc không cần.",
      "2. Chi phí: IVM thường rẻ hơn IVF do ít thuốc và ít cuộc hẹn giám sát hơn.",
      "3. Thời gian Cam kết: IVF yêu cầu nhiều lần đến phòng khám để theo dõi hơn, trong khi IVM yêu cầu ít cuộc hẹn hơn.",
      "4. Tỷ lệ Thành công: IVF hiện có tỷ lệ thành công cao hơn (30-40% mỗi chu kỳ) so với IVM (20-30% mỗi chu kỳ).",
      "5. Đối tượng Phù hợp: IVF phù hợp với hầu hết các bệnh nhân sinh sản, trong khi IVM có thể đặc biệt hữu ích cho phụ nữ mắc PCOS, những người có nguy cơ hội chứng kích thích buồng trứng quá mức, bệnh nhân ung thư bảo tồn khả năng sinh sản trước điều trị, hoặc những người có tình trạng nhạy cảm với hormone."
    ],
    relatedPosts: [1, 2, 6]
  },
  {
    id: 4,
    slug: "pregnancy-test-step-by-step",
    title: "Cách Thực Hiện Xét Nghiệm Thai, Từng Bước",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc3.jpg",
    author: "TS. Emily Roberts",
    authorImage: "/images/features/Pc1.jpg",
    readTime: "5 phút đọc",
    category: "Thai Kỳ",
    tags: ["Xét Nghiệm Thai", "Thai Kỳ Sớm", "Sức Khỏe Phụ Nữ"],
    summary: "Hướng dẫn toàn diện về cách thực hiện xét nghiệm thai tại nhà đúng cách để có kết quả chính xác nhất.",
    content: [
      "Việc thực hiện xét nghiệm thai đúng cách là điều cần thiết để có kết quả chính xác. Dưới đây là hướng dẫn từng bước chi tiết để giúp bạn thực hiện quy trình này:",
      "Khi Nào Nên Xét Nghiệm:",
      "• Chờ đến ít nhất ngày đầu tiên của kỳ kinh bị trễ để có kết quả chính xác nhất",
      "• Một số xét nghiệm nhạy có thể phát hiện thai kỳ sớm đến 5 ngày trước kỳ kinh bị trễ",
      "• Nước tiểu buổi sáng có nồng độ hCG (hormone thai kỳ) cao nhất",
      
      "Những Gì Bạn Cần:",
      "• Bộ xét nghiệm thai tại nhà",
      "• Cốc sạch (nếu không sử dụng xét nghiệm trực tiếp dòng chảy)",
      "• Đồng hồ hoặc đồng hồ bấm giờ",
      "• Sự riêng tư và phòng tắm có ánh sáng tốt",
      
      "Bước 1: Đọc Kỹ Hướng Dẫn",
      "Mỗi nhãn hiệu xét nghiệm thai có thể có hướng dẫn hơi khác nhau. Hãy dành thời gian để đọc và hiểu các hướng dẫn cụ thể cho xét nghiệm của bạn.",
      
      "Bước 2: Thu Thập Mẫu Nước Tiểu",
      "Hoặc đi tiểu trực tiếp lên đầu que xét nghiệm hoặc thu thập nước tiểu vào cốc sạch và nhúng que xét nghiệm theo hướng dẫn.",
      
      "Bước 3: Chờ Thời Gian Chỉ Định",
      "Đặt que xét nghiệm trên bề mặt phẳng và chờ đúng thời gian được chỉ định (thường là 1-5 phút). Đặt đồng hồ bấm giờ để chính xác.",
      
      "Bước 4: Đọc Kết Quả",
      "Kiểm tra cửa sổ kết quả trong khoảng thời gian được chỉ định. Kết quả đọc quá sớm hoặc quá muộn có thể không chính xác.",
      
      "Hiểu Kết Quả:",
      "• Dương tính: Ngay cả một vạch thứ hai mờ thường cho thấy có thai",
      "• Âm tính: Chỉ xuất hiện vạch kiểm soát",
      "• Không hợp lệ: Không có vạch nào hoặc chỉ có vạch xét nghiệm (không có vạch kiểm soát)",
      
      "Các Bước Tiếp Theo:",
      "• Kết quả dương tính: Đặt lịch hẹn với nhà cung cấp dịch vụ y tế của bạn",
      "• Kết quả âm tính nhưng vẫn có triệu chứng: Chờ vài ngày và xét nghiệm lại",
      "• Kết quả không hợp lệ: Lặp lại với một que xét nghiệm mới",
      
      "Hãy nhớ rằng các xét nghiệm thai tại nhà có độ chính xác khoảng 99% khi sử dụng đúng cách, nhưng các yếu tố như thuốc, xét nghiệm quá sớm, hoặc sử dụng que xét nghiệm hết hạn có thể ảnh hưởng đến kết quả."
    ],
    relatedPosts: [1, 5, 9]
  },
  {
    id: 5,
    slug: "fertility-preservation-for-cancer-patients",
    title: "Bảo Quản Khả Năng Sinh Sản Cho Phụ Nữ Được Chẩn Đoán Ung Thư",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc9.jpg",
    author: "TS. Sarah Johnson",
    authorImage: "/images/features/pc11.jpg",
    readTime: "9 phút đọc",
    category: "Bảo Quản Sinh Sản",
    tags: ["Ung Thư", "Bảo Quản Sinh Sản", "Đông Lạnh Trứng", "Sinh Sản Ung Thư"],
    summary: "Tìm hiểu về các lựa chọn dành cho phụ nữ được chẩn đoán ung thư để bảo quản khả năng sinh sản trước khi trải qua các điều trị có thể ảnh hưởng đến chức năng sinh sản.",
    content: [
      "Chẩn đoán ung thư là một sự thay đổi lớn trong cuộc sống, và đối với phụ nữ ở độ tuổi sinh sản, những lo lắng về khả năng sinh sản trong tương lai thêm một tầng phức tạp. May mắn thay, những tiến bộ trong y học sinh sản cung cấp một số lựa chọn để bảo quản khả năng sinh sản trước khi bắt đầu điều trị ung thư.",
      
      "Tại Sao Điều Trị Ung Thư Ảnh Hưởng Đến Sinh Sản:",
      "Nhiều phương pháp điều trị ung thư có thể làm tổn hại khả năng sinh sản. Hóa trị có thể làm tổn thương trứng, xạ trị vùng chậu có thể ảnh hưởng đến các cơ quan sinh sản, và một số phẫu thuật có thể loại bỏ các cấu trúc sinh sản. Mức độ nguy cơ thay đổi dựa trên loại điều trị, liều lượng, và tuổi của phụ nữ.",
      
      "Các Lựa Chọn Bảo Quản Sinh Sản:",
      
      "1. Đông Lạnh Trứng (Bảo Quản Noãn Bằng Lạnh)",
      "Đây là phương pháp được thiết lập nhất cho phụ nữ không có bạn đời. Quy trình bao gồm kích thích hormone trong 10-14 ngày, lấy trứng, và đông lạnh các trứng chưa thụ tinh để sử dụng trong tương lai. Đối với phụ nữ bị ung thư, các giao thức có thể được điều chỉnh để giảm tiếp xúc với hormone.",
      
      "2. Đông Lạnh Phôi",
      "Tương tự như đông lạnh trứng nhưng bao gồm thụ tinh với tinh trùng của bạn đời hoặc người hiến trước khi đông lạnh. Phương pháp này cung cấp tỷ lệ thành công cao hơn một chút so với đông lạnh trứng nhưng yêu cầu một nguồn tinh trùng.",
      
      "3. Đông Lạnh Mô Buồng Trứng",
      "Lựa chọn thử nghiệm này bao gồm việc lấy ra và đông lạnh mô buồng trứng chứa các trứng chưa trưởng thành. Sau đó, mô này có thể được cấy ghép lại. Đây là lựa chọn duy nhất cho các bé gái chưa dậy thì và phụ nữ không thể trì hoãn điều trị.",
      
      "4. Ức Chế Buồng Trứng Trong Quá Trình Điều Trị",
      "Các loại thuốc (chất chủ vận GnRH) có thể giúp bảo vệ buồng trứng trong quá trình hóa trị bằng cách đưa chúng vào trạng thái tạm thời không hoạt động, mặc dù bằng chứng về hiệu quả còn khác nhau.",
      
      "5. Di Dời Buồng Trứng",
      "Đối với phụ nữ nhận xạ trị vùng chậu, việc phẫu thuật di chuyển buồng trứng ra khỏi vùng xạ trị có thể bảo vệ chức năng.",
      
      "Quá Trình Ra Quyết Định:",
      "• Tham khảo ý kiến bác sĩ nội tiết sinh sản ngay sau khi chẩn đoán",
      "• Xem xét tuổi, tình trạng mối quan hệ, kế hoạch điều trị và loại ung thư",
      "• Thảo luận về khía cạnh tài chính và bảo hiểm",
      "• Tìm kiếm các nguồn hỗ trợ cảm xúc cho quyết định phức tạp này",
      
      "Thời gian là rất quan trọng, vì bảo quản khả năng sinh sản lý tưởng nên được thực hiện trước khi bắt đầu điều trị ung thư. Tuy nhiên, trong nhiều trường hợp, quy trình có thể được đẩy nhanh để tránh trì hoãn điều trị đáng kể."
    ],
    relatedPosts: [2, 3, 7]
  },
  {
    id: 6,
    slug: "male-infertility-facts",
    title: "Vô Sinh Nam: Sự Thật và Huyền Thoại",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc10.jpg",
    author: "TS. Michael Brown",
    authorImage: "/images/features/pc12.jpg",
    readTime: "7 phút đọc",
    category: "Sinh Sản",
    tags: ["Vô Sinh Nam", "Sức Khỏe Nam Giới", "Sức Khỏe Sinh Sản"],
    summary: "Phân biệt giữa huyền thoại và thực tế về nguyên nhân, chẩn đoán và các lựa chọn điều trị vô sinh nam.",
    content: [
      "Vô sinh nam thường bị bao quanh bởi những quan niệm sai lầm và kỳ thị. Hiểu biết về sự thật là rất quan trọng để chẩn đoán và điều trị đúng cách. Hãy phân biệt giữa sự thật và huyền thoại về chủ đề quan trọng này.",
      
      "Huyền Thoại: Vô sinh chủ yếu là vấn đề của phụ nữ.",
      "Sự Thật: Các yếu tố từ nam giới góp phần vào khoảng 50% các trường hợp vô sinh. Trong khoảng một phần ba các trường hợp, yếu tố nam là nguyên nhân duy nhất gây vô sinh.",
      
      "Huyền Thoại: Các yếu tố lối sống có tác động tối thiểu đến khả năng sinh sản nam.",
      "Sự Thật: Một số yếu tố lối sống ảnh hưởng đáng kể đến sức khỏe tinh trùng, bao gồm hút thuốc, uống rượu quá mức, sử dụng ma túy, béo phì, tiếp xúc với độc tố môi trường, và tiếp xúc lâu dài với nhiệt độ cao ở tinh hoàn (từ việc sử dụng bồn tắm nước nóng thường xuyên, phòng xông hơi, hoặc mặc quần áo bó sát).",
      
      "Huyền Thoại: Tuổi tác không ảnh hưởng đến khả năng sinh sản nam.",
      "Sự Thật: Mặc dù nam giới sản xuất tinh trùng suốt đời, chất lượng và số lượng tinh trùng suy giảm theo tuổi, đặc biệt sau 40 tuổi. Tuổi cha cao cũng liên quan đến tăng nguy cơ bất thường di truyền và một số tình trạng sức khỏe ở con cái.",
      
      "Huyền Thoại: Số lượng tinh trùng thấp luôn đồng nghĩa với vô sinh.",
      "Sự Thật: Mặc dù số lượng tinh trùng bình thường cải thiện cơ hội thụ thai, nam giới có số lượng tinh trùng thấp vẫn có thể có con. Ngay cả một tinh trùng khỏe mạnh cũng có thể thụ tinh với trứng, đặc biệt với các công nghệ hỗ trợ sinh sản.",
      
      "Huyền Thoại: Vô sinh nam không thể điều trị.",
      "Sự Thật: Nhiều nguyên nhân gây vô sinh nam có thể điều trị hoặc có thể vượt qua bằng các kỹ thuật hỗ trợ sinh sản:",
      "• Mất cân bằng hormone thường có thể được điều chỉnh bằng thuốc",
      "• Giãn tĩnh mạch thừng tinh (tĩnh mạch mở rộng ở bìu) có thể được sửa chữa bằng phẫu thuật",
      "• Tắc nghẽn trong đường sinh sản đôi khi có thể được loại bỏ",
      "• Nhiễm trùng có thể được điều trị bằng kháng sinh",
      "• ICSI (Tiêm tinh trùng vào bào tương) có thể đạt được thụ tinh ngay cả với rất ít tinh trùng",
      
      "Huyền Thoại: Nếu một người đàn ông đã có con trước đây, anh ta không thể có vấn đề sinh sản bây giờ.",
      "Sự Thật: Vô sinh thứ phát (khó thụ thai sau khi đã có con trước đó) là phổ biến và có thể do các vấn đề sức khỏe mới, suy giảm sinh sản liên quan đến tuổi, hoặc thay đổi trong các yếu tố lối sống.",
      
      "Huyền Thoại: Chất lượng tinh trùng không thể cải thiện.",
      "Sự Thật: Nhiều nam giới có thể cải thiện các thông số tinh trùng thông qua các thay đổi lối sống bao gồm:",
      "• Duy trì cân nặng khỏe mạnh",
      "• Ăn chế độ ăn uống cân bằng giàu chất chống oxy hóa",
      "• Tập thể dục vừa phải thường xuyên",
      "• Giảm căng thẳng",
      "• Tránh thuốc lá, rượu quá mức, và các chất kích thích",
      "• Uống bổ sung thích hợp (dưới sự hướng dẫn y tế)"
    ],
    relatedPosts: [2, 3, 7]
  },
  {
    id: 7,
    slug: "endo-and-fertility-health",
    title: "Lạc Nội Mạc Tử Cung và Sức Khỏe Sinh Sản",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc11.jpg",
    author: "TS. Emily Roberts",
    authorImage: "/images/features/Pc1.jpg",
    readTime: "11 phút đọc",
    category: "Sức Khỏe Phụ Nữ",
    tags: ["Lạc Nội Mạc Tử Cung", "Sinh Sản", "Sức Khỏe Phụ Nữ", "Sức Khỏe Sinh Sản"],
    summary: "Lạc nội mạc tử cung ảnh hưởng đến khả năng sinh sản như thế nào và các lựa chọn điều trị dành cho phụ nữ mắc tình trạng này muốn thụ thai.",
    content: [
      "Lạc nội mạc tử cung ảnh hưởng đến khoảng 10% phụ nữ trong độ tuổi sinh sản trên toàn thế giới và là một nguyên nhân hàng đầu gây vô sinh. Hiểu biết về mối quan hệ giữa lạc nội mạc tử cung và khả năng sinh sản là rất quan trọng cho phụ nữ được chẩn đoán mắc tình trạng này và hy vọng có con.",
      
      "Lạc Nội Mạc Tử Cung Ảnh Hưởng Đến Sinh Sản Như Thế Nào:",
      
      "Lạc nội mạc tử cung xảy ra khi mô tương tự lớp nội mạc tử cung phát triển ngoài tử cung. Tình trạng này có thể ảnh hưởng đến khả năng sinh sản theo nhiều cách:",
      
      "1. Biến dạng Giải phẫu: Lạc nội mạc tử cung nghiêm trọng có thể gây dính và sẹo làm biến dạng giải phẫu vùng chậu, có khả năng chặn ống dẫn trứng hoặc cản trở chức năng buồng trứng.",
      
      "2. Viêm: Môi trường viêm do lạc nội mạc tử cung có thể gây độc cho trứng, tinh trùng và phôi thai.",
      
      "3. Mất Cân Bằng Hormone: Lạc nội mạc tử cung có thể làm gián đoạn môi trường hormone cần thiết cho việc thụ thai và cấy ghép phôi.",
      
      "4. Giảm Chất Lượng Trứng: Một số nghiên cứu cho thấy lạc nội mạc tử cung có thể ảnh hưởng đến chất lượng trứng và dự trữ buồng trứng.",
      
      "5. Khó Khăn Trong Cấy Ghép: Ngay cả với ống dẫn trứng bình thường, phụ nữ mắc lạc nội mạc tử cung có thể có tỷ lệ cấy ghép phôi thấp hơn.",
      
      "Các Lựa Chọn Điều Trị Sinh Sản Cho Phụ Nữ Mắc Lạc Nội Mạc Tử Cung:",
      
      "1. Quản Lý Y Khoa:",
      "Mặc dù các phương pháp điều trị hormone (như thuốc tránh thai) thường được sử dụng để kiểm soát triệu chứng lạc nội mạc tử cung, chúng ngăn ngừa thai kỳ và phải ngừng khi cố gắng thụ thai. Tuy nhiên, một số bác sĩ khuyên dùng một liệu trình ức chế hormone trước khi thử thụ thai.",
      
      "2. Điều Trị Phẫu Thuật:",
      "Phẫu thuật nội soi để loại bỏ các tổn thương lạc nội mạc tử cung có thể cải thiện tỷ lệ sinh sản tự nhiên, đặc biệt đối với lạc nội mạc tử cung tối thiểu đến nhẹ. Lợi ích đối với bệnh nặng không rõ ràng nhưng có thể cải thiện kết quả IVF.",
      
      "3. Công Nghệ Hỗ Trợ Sinh Sản:",
      "• Thuốc sinh sản với giao hợp định thời hoặc thụ tinh nhân tạo (IUI) có thể hiệu quả đối với lạc nội mạc tử cung tối thiểu đến nhẹ",
      "• Thụ tinh trong ống nghiệm (IVF) thường mang lại tỷ lệ thành công cao nhất, đặc biệt đối với các trường hợp trung bình đến nặng",
      "• IVF với ICSI (tiêm tinh trùng vào bào tương) có thể được khuyến nghị nếu có lo ngại về chất lượng trứng",
      
      "Cân Nhắc Về Thời Gian:",
      "Đối với phụ nữ được chẩn đoán lạc nội mạc tử cung muốn có con, thời gian là một yếu tố quan trọng. Vì lạc nội mạc tử cung có thể tiến triển và khả năng sinh sản giảm theo tuổi, có thể nên không trì hoãn việc thử mang thai quá lâu sau khi chẩn đoán.",
      
      "Tin tốt là nhiều phụ nữ mắc lạc nội mạc tử cung thụ thai thành công và có thai kỳ khỏe mạnh, hoặc tự nhiên hoặc với các phương pháp điều trị sinh sản phù hợp. Tham khảo sớm với bác sĩ nội tiết sinh sản có thể giúp phát triển kế hoạch điều trị hiệu quả nhất."
    ],
    relatedPosts: [2, 5, 9]
  },
  {
    id: 8,
    slug: "zika-virus-risks-for-patients",
    title: "Nguy Cơ Đối Với Bệnh Nhân Tiếp Xúc Với Virus Zika",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc12.jpg",
    author: "TS. Andrew Peterson",
    authorImage: "/images/features/pc10.jpg",
    readTime: "8 phút đọc",
    category: "Cảnh Báo Sức Khỏe",
    tags: ["Virus Zika", "Thai Kỳ", "Sức Khỏe Cộng Đồng", "Bệnh Truyền Nhiễm"],
    summary: "Hiểu biết về nguy cơ phơi nhiễm virus Zika đối với phụ nữ mang thai và những người đang cố gắng thụ thai, cùng với các chiến lược phòng ngừa.",
    content: [
      "Virus Zika đã nổi lên như một mối quan ngại sức khỏe toàn cầu đáng kể do liên quan đến các dị tật bẩm sinh nghiêm trọng. Hiểu biết về các nguy cơ và các biện pháp phòng ngừa thích hợp là điều cần thiết cho các bệnh nhân sinh sản và phụ nữ mang thai.",
      
      "Lây Truyền Virus Zika:",
      "Virus Zika chủ yếu được lây truyền qua vết cắn của muỗi Aedes bị nhiễm bệnh. Nó cũng có thể lây truyền qua đường tình dục và từ mẹ sang thai nhi trong thai kỳ. Hầu hết những người nhiễm virus Zika không có triệu chứng hoặc chỉ gặp các triệu chứng nhẹ bao gồm sốt, phát ban, đau khớp và viêm kết mạc.",
      
      "Nguy Cơ Đối Với Thai Kỳ:",
      "Mối quan ngại lớn nhất với virus Zika là tác động của nó đến sự phát triển của thai nhi. Nhiễm virus Zika trong thai kỳ có thể gây ra:",
      
      "• Đầu nhỏ (đầu và não nhỏ bất thường)",
      "• Các khuyết tật não nghiêm trọng khác",
      "• Bất thường về mắt",
      "• Mất thính lực",
      "• Suy giảm tăng trưởng",
      "• Hội chứng Zika bẩm sinh (một mô hình các dị tật bẩm sinh bao gồm bất thường não, khuyết tật mắt, vấn đề khớp và vấn đề về trương lực cơ)",
      
      "Nguy cơ dị tật bẩm sinh dường như cao nhất khi nhiễm bệnh xảy ra trong ba tháng đầu, nhưng virus có thể gây ra biến chứng trong suốt thai kỳ.",
      
      "Khuyến Cáo Cho Bệnh Nhân Sinh Sản và Phụ Nữ Mang Thai:",
      
      "1. Phòng Ngừa Khi Du Lịch:",
      "• Tránh du lịch đến các khu vực có lây truyền Zika hoạt động nếu có thể",
      "• Nếu cần du lịch, thực hiện các biện pháp phòng ngừa cắn muỗi nghiêm ngặt",
      "• Kiểm tra các trang web của CDC hoặc WHO để biết các cảnh báo du lịch Zika hiện tại",
      
      "2. Thời Điểm Mang Thai:",
      "• Phụ nữ phơi nhiễm với Zika nên chờ ít nhất 8 tuần trước khi cố gắng thụ thai",
      "• Nam giới phơi nhiễm với Zika nên chờ ít nhất 3 tháng trước khi quan hệ không bảo vệ hoặc cung cấp tinh trùng cho hỗ trợ sinh sản",
      
      "3. Đối Với Những Người Đang Điều Trị Sinh Sản:",
      "• Cân nhắc xét nghiệm virus Zika trước khi bắt đầu điều trị nếu có khả năng phơi nhiễm",
      "• Một số trung tâm sinh sản có thể yêu cầu xét nghiệm cho bệnh nhân đã đi đến các khu vực bị ảnh hưởng bởi Zika",
      "• Người hiến tặng giao tử (trứng/tinh trùng) nên được sàng lọc các yếu tố nguy cơ Zika",
      
      "4. Biện Pháp Phòng Ngừa:",
      "• Sử dụng thuốc chống côn trùng đã đăng ký với EPA",
      "• Mặc áo dài tay và quần dài",
      "• Ở trong những nơi có điều hòa không khí và màn cửa sổ/cửa ra vào",
      "• Loại bỏ nước đọng xung quanh nhà",
      "• Sử dụng bao cao su hoặc kiêng quan hệ nếu bạn tình có thể bị nhiễm bệnh",
      
      "Nếu bạn đang lên kế hoạch mang thai hoặc đã mang thai và lo ngại về khả năng phơi nhiễm Zika, hãy tham khảo ý kiến nhà cung cấp dịch vụ y tế của bạn ngay lập tức để được hướng dẫn và xét nghiệm nếu phù hợp."
    ],
    relatedPosts: [1, 4, 9]
  },
  {
    id: 9,
    slug: "endometriosis-and-pregnancy",
    title: "Lạc Nội Mạc Tử Cung và Thai Kỳ",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/Pc1.jpg",
    author: "TS. Sarah Johnson",
    authorImage: "/images/features/pc11.jpg",
    readTime: "10 phút đọc",
    category: "Thai Kỳ",
    tags: ["Lạc Nội Mạc Tử Cung", "Thai Kỳ", "Sức Khỏe Phụ Nữ"],
    summary: "Những điều phụ nữ mắc lạc nội mạc tử cung nên biết về thai kỳ, từ những thách thức trong việc thụ thai đến quản lý tình trạng này trong thai kỳ.",
    content: [
      "Đối với phụ nữ mắc lạc nội mạc tử cung có thai, việc hiểu cách tình trạng này có thể ảnh hưởng đến thai kỳ—và cách thai kỳ có thể ảnh hưởng đến lạc nội mạc tử cung—là quan trọng để đảm bảo sức khỏe tối ưu cho mẹ và thai nhi.",
      
      "Lạc Nội Mạc Tử Cung và Thụ Thai:",
      "Mặc dù lạc nội mạc tử cung có thể làm cho việc thụ thai khó khăn hơn, nhiều phụ nữ mắc tình trạng này vẫn mang thai tự nhiên. Đối với những người khác, các phương pháp điều trị sinh sản như kích thích rụng trứng, thụ tinh nhân tạo (IUI), hoặc thụ tinh trong ống nghiệm (IVF) có thể cần thiết, tùy thuộc vào mức độ nghiêm trọng của tình trạng và các yếu tố sinh sản khác.",
      
      "Ảnh Hưởng của Thai Kỳ đến Triệu Chứng Lạc Nội Mạc Tử Cung:",
      "Nhiều phụ nữ trải qua sự giảm triệu chứng lạc nội mạc tử cung tạm thời trong thai kỳ. Điều này chủ yếu do những thay đổi hormone xảy ra, đặc biệt là sự vắng mặt của kinh nguyệt và mức progesterone cao được sản xuất trong thai kỳ có thể ức chế sự phát triển của lạc nội mạc tử cung.",
      
      "Tuy nhiên, điều quan trọng cần lưu ý là thai kỳ không phải là 'phương pháp chữa trị' cho lạc nội mạc tử cung. Mặc dù các triệu chứng thường cải thiện, tình trạng cơ bản vẫn tồn tại, và các triệu chứng có thể trở lại sau khi sinh, đặc biệt khi kinh nguyệt trở lại.",
      
      "Các Biến Chứng Thai Kỳ và Lạc Nội Mạc Tử Cung:",
      "Nghiên cứu đã phát hiện rằng phụ nữ mắc lạc nội mạc tử cung có thể có nguy cơ cao hơn một chút đối với một số biến chứng thai kỳ:",
      
      "• Sảy thai (nguy cơ cao hơn khoảng 1.5 lần)",
      "• Thai ngoài tử cung (đặc biệt nếu ống dẫn trứng bị ảnh hưởng bởi lạc nội mạc tử cung)",
      "• Rau tiền đạo (khi nhau thai che phủ toàn bộ hoặc một phần cổ tử cung)",
      "• Sinh non",
      "• Sinh mổ",
      "• Thai nhi nhỏ so với tuổi thai",
      "• Tăng huyết áp do thai kỳ",
      
      "Điều quan trọng cần nhấn mạnh rằng mặc dù những nguy cơ này cao hơn về mặt thống kê, nguy cơ tuyệt đối vẫn tương đối thấp, và hầu hết phụ nữ mắc lạc nội mạc tử cung có thai kỳ bình thường và sinh con khỏe mạnh.",
      
      "Quản Lý Lạc Nội Mạc Tử Cung Trong Thai Kỳ:",
      
      "1. Chăm Sóc Trước Sinh:",
      "• Thông báo cho bác sĩ sản khoa về chẩn đoán lạc nội mạc tử cung của bạn",
      "• Cân nhắc tham khảo ý kiến chuyên gia y học mẹ và thai nhi cho chăm sóc thai kỳ nguy cơ cao nếu lạc nội mạc tử cung của bạn nghiêm trọng",
      "• Tham dự tất cả các cuộc hẹn trước sinh được khuyến nghị để theo dõi thích hợp",
      
      "2. Quản Lý Đau:",
      "• Thảo luận các lựa chọn quản lý đau an toàn với nhà cung cấp dịch vụ y tế của bạn nếu đau do lạc nội mạc tử cung kéo dài trong thai kỳ",
      "• Các phương pháp không dùng thuốc như liệu pháp nhiệt, vật lý trị liệu, và kỹ thuật thư giãn có thể hữu ích",
      
      "3. Hỗ Trợ Tinh Thần:",
      "• Mang thai với một tình trạng mãn tính có thể gây thách thức về mặt cảm xúc",
      "• Cân nhắc tham gia các nhóm hỗ trợ cho phụ nữ mắc lạc nội mạc tử cung",
      "• Đừng ngần ngại thảo luận về các mối quan ngại sức khỏe tinh thần với đội ngũ y tế của bạn",
      
      "Cân Nhắc Sau Sinh:",
      "Sau khi sinh, các triệu chứng lạc nội mạc tử cung thường trở lại khi chu kỳ kinh nguyệt tiếp tục. Cho con bú có thể trì hoãn sự trở lại của các triệu chứng vì nó có thể trì hoãn sự trở lại của kinh nguyệt. Thảo luận kế hoạch quản lý lạc nội mạc tử cung dài hạn của bạn với nhà cung cấp dịch vụ y tế trong các lần kiểm tra sau sinh."
    ],
    relatedPosts: [1, 4, 7]
  }
];

const BlogDetailPage = () => {
  const { blogSlug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // Check if blogSlug exists
    if (!blogSlug) {
      navigate('/blog');
      return;
    }

    // Find the post by slug
    const blogPost = blogPostsData.find(post => post.slug === blogSlug);
    if (blogPost) {
      setPost(blogPost);
      
      // Find related posts
      if (blogPost.relatedPosts && blogPost.relatedPosts.length > 0) {
        const related = blogPostsData.filter(p => 
          blogPost.relatedPosts.includes(p.id)
        );
        setRelatedPosts(related);
      }
    } else {
      // Redirect to blog page if post not found
      navigate('/blog');
    }
  }, [blogSlug, navigate]);

  if (!post) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-4">
            <div className="flex justify-center items-center mb-4">
              <Tag color="#ff8460" className="text-white px-3 py-1 mr-2">{post.category}</Tag>
              <span className="text-white flex items-center">
                <ClockCircleOutlined className="mr-1" />{post.readTime}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center justify-center text-white text-sm">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">BLOG</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">{post.category.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              {/* Author Info */}
              <div className="flex items-center mb-8">
                <Avatar 
                  src={post.authorImage} 
                  size={64} 
                  icon={<UserOutlined />} 
                  className="mr-4"
                />
                <div>
                  <Text strong className="block text-lg">{post.author}</Text>
                  <Text type="secondary" className="flex items-center">
                    <CalendarOutlined className="mr-2" /> {post.date}
                  </Text>
                </div>
              </div>

              {/* Content */}
              <div className="blog-content mb-10">
                <Paragraph className="text-lg font-medium mb-8">
                  {post.summary}
                </Paragraph>
                
                {post.content.map((paragraph, index) => (
                  <Paragraph key={index} className="text-gray-700 mb-6">
                    {paragraph}
                  </Paragraph>
                ))}
              </div>

              {/* Tags */}
              <div className="mb-10">
                <div className="flex flex-wrap items-center">
                  <TagOutlined className="mr-2 text-gray-500" />
                  {post.tags.map(tag => (
                    <Tag 
                      key={tag} 
                      className="mr-2 mb-2 px-3 py-1 border-gray-300"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Share */}
              <Divider />
              
              {/* Related Posts - Mobile View */}
              <div className="lg:hidden mb-10">
                <Title level={4} className="mb-6">Bài Viết Liên Quan</Title>
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2 }}
                  dataSource={relatedPosts}
                  renderItem={item => (
                    <List.Item>
                      <Link to={`/blog/${item.slug}`}>
                        <Card 
                          hoverable 
                          cover={<img alt={item.title} src={item.image} className="h-48 object-cover" />}
                          className="border border-gray-200"
                        >
                          <Card.Meta 
                            title={item.title} 
                            description={
                              <Space direction="vertical">
                                <Text type="secondary">{item.date}</Text>
                                <Button 
                                  type="text" 
                                  icon={<RightOutlined className="bg-[#ff8460] text-white rounded-full p-1 mr-2" />}
                                  className="text-[#ff8460] hover:text-[#ff6b40] px-0"
                                >
                                  Đọc Thêm
                                </Button>
                              </Space>
                            } 
                          />
                        </Card>
                      </Link>
                    </List.Item>
                  )}
                />
              </div>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              {/* Related Posts */}
              <div className="hidden lg:block">
                <Card 
                  title="Bài Viết Liên Quan" 
                  className="mb-8 border border-gray-200"
                  headStyle={{ borderBottom: '2px solid #ff8460' }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={relatedPosts}
                    renderItem={item => (
                      <List.Item className="border-b last:border-b-0">
                        <Link to={`/blog/${item.slug}`} className="w-full">
                          <div className="flex items-center py-2">
                            <div className="w-20 h-20 mr-4 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <Text strong className="hover:text-[#ff8460] transition-colors">
                                {item.title}
                              </Text>
                              <Text type="secondary" className="block mt-1">
                                {item.date}
                              </Text>
                            </div>
                          </div>
                        </Link>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>

              {/* Categories */}
              <Card 
                title="Danh Mục" 
                className="mb-8 border border-gray-200"
                headStyle={{ borderBottom: '2px solid #ff8460' }}
              >
                <List
                  dataSource={[
                    { name: 'Thai Kỳ', count: 4 },
                    { name: 'Sinh Sản', count: 3 },
                    { name: 'Sức Khỏe Phụ Nữ', count: 5 },
                    { name: 'Điều Trị Sinh Sản', count: 2 },
                    { name: 'Cảnh Báo Sức Khỏe', count: 1 }
                  ]}
                  renderItem={item => (
                    <List.Item className="border-b last:border-b-0 py-2">
                      <Link to={`/blog`} className="flex justify-between w-full hover:text-[#ff8460] transition-colors">
                        <span>{item.name}</span>
                        <span>({item.count})</span>
                      </Link>
                    </List.Item>
                  )}
                />
              </Card>

              {/* Tags Cloud */}
              <Card 
                title="Thẻ Phổ Biến" 
                className="mb-8 border border-gray-200"
                headStyle={{ borderBottom: '2px solid #ff8460' }}
              >
                <div className="flex flex-wrap">
                  {['Thai Kỳ', 'Sinh Sản', 'IVF', 'Sức Khỏe Phụ Nữ', 'Lạc Nội Mạc Tử Cung', 
                    'Làm Mẹ', 'Đông Lạnh Trứng', 'Sức Khỏe Sinh Sản', 'Vô Sinh'].map(tag => (
                    <Tag 
                      key={tag} 
                      className="mr-2 mb-2 py-1 px-3 border-gray-300 cursor-pointer hover:border-[#ff8460] hover:text-[#ff8460] transition-colors"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </Card>

              {/* Subscribe */}
              <Card 
                title="Đăng Ký" 
                className="border border-gray-200"
                headStyle={{ borderBottom: '2px solid #ff8460' }}
              >
                <Paragraph>
                  Nhận các bài viết và thông tin mới nhất từ các chuyên gia sinh sản của chúng tôi
                </Paragraph>
                <div className="mt-4">
                  <Button 
                    type="primary" 
                    className="w-full bg-[#ff8460] hover:bg-[#ff6b40] border-none"
                    onClick={() => navigate('/contacts')}
                  >
                    Liên Hệ Với Chúng Tôi
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      
      <UserFooter />
    </div>
  );
};

export default BlogDetailPage;