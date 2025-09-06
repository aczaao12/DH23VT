import React from 'react';
import './TermsOfServiceView.css';

const TermsOfServiceView = () => {
  return (
    <div className="terms-of-service-container">
      <h1>Điều khoản dịch vụ</h1>

      <h2>1. Giới thiệu</h2>
      <p>Bằng việc truy cập và sử dụng Ứng dụng quản lý hoạt động sinh viên (“Ứng dụng”), bạn đồng ý tuân thủ các điều khoản dưới đây. Nếu bạn không đồng ý, vui lòng ngừng sử dụng Ứng dụng.</p>

      <h2>2. Tài khoản người dùng</h2>
      <p>Người dùng đăng nhập bằng tài khoản Google để sử dụng Ứng dụng.</p>
      <p>Bạn chịu trách nhiệm bảo mật tài khoản của mình và mọi hoạt động phát sinh từ tài khoản.</p>

      <h2>3. Nội dung do người dùng tạo</h2>
      <p>Bạn có thể tải lên dữ liệu hoặc nội dung thông qua chức năng upload.</p>
      <p>Bạn cam kết chỉ tải lên nội dung hợp pháp và không vi phạm bản quyền, pháp luật hoặc quyền riêng tư của người khác.</p>

      <h2>4. Quyền sở hữu và lưu trữ dữ liệu</h2>
      <p>Dữ liệu bạn tải lên được lưu trữ tại dịch vụ Firebase.</p>
      <p>Chúng tôi không sở hữu nội dung bạn tải lên.</p>

      <h2>5. Giới hạn trách nhiệm</h2>
      <p>Ứng dụng được cung cấp “nguyên trạng”, không có bảo đảm tuyệt đối về tính chính xác, độ sẵn sàng hoặc không gián đoạn.</p>
      <p>Chúng tôi không chịu trách nhiệm cho thiệt hại phát sinh từ việc sử dụng hoặc không thể sử dụng Ứng dụng.</p>

      <h2>6. Thay đổi điều khoản</h2>
      <p>Chúng tôi có thể cập nhật Điều khoản dịch vụ này bất kỳ lúc nào. Phiên bản mới nhất sẽ được công khai trên Trang web.</p>

      <h2>7. Liên hệ</h2>
      <p>Nếu bạn có câu hỏi về Điều khoản dịch vụ, vui lòng liên hệ qua e-mail: aczaao12@gmail.com</p>
    </div>
  );
};

export default TermsOfServiceView;
