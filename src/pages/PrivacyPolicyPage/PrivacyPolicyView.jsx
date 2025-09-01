import React from 'react';
import './PrivacyPolicyView.css';

const PrivacyPolicyView = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Chính sách bảo mật</h1>
      <p>
        Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ
        thông tin cá nhân của bạn khi bạn sử dụng Ứng dụng quản lý hoạt động sinh viên
        (“Ứng dụng”).
      </p>

      <h2>Thông tin cá nhân chúng tôi thu thập</h2>
      <p>
        Khi bạn đăng nhập bằng Google, chúng tôi thu thập các thông tin cơ bản
        do Google cung cấp, bao gồm <strong>avatar</strong> và <strong>địa chỉ email</strong>.
      </p>
      <p>
        Ngoài ra, nếu bạn sử dụng chức năng <strong>upload</strong> trong Ứng dụng,
        dữ liệu mà bạn tải lên sẽ được lưu trữ tại dịch vụ của Firebase.
      </p>

      <h2>Cách chúng tôi sử dụng thông tin của bạn</h2>
      <p>
        Thông tin được thu thập chỉ nhằm mục đích xác thực tài khoản, hiển thị hồ sơ người dùng
        và lưu trữ nội dung mà bạn tải lên. Chúng tôi không sử dụng dữ liệu của bạn cho mục đích quảng cáo
        hoặc bán cho bên thứ ba.
      </p>

      <h2>Chia sẻ dữ liệu</h2>
      <p>
        Dữ liệu của bạn được lưu trữ duy nhất trên các dịch vụ của Firebase.
        Không có bất kỳ bên thứ ba nào khác có quyền truy cập hoặc sở hữu dữ liệu của bạn.
      </p>

      <h2>Lưu giữ dữ liệu</h2>
      <p>
        Dữ liệu của bạn sẽ được lưu giữ cho đến khi bạn yêu cầu xóa hoặc khi tài khoản
        của bạn bị xóa khỏi hệ thống.
      </p>

      <h2>Thay đổi</h2>
      <p>
        Chúng tôi có thể cập nhật chính sách bảo mật này để phản ánh thay đổi trong dịch vụ
        hoặc yêu cầu pháp lý. Phiên bản mới nhất luôn được công khai trên Trang web.
      </p>

      <h2>Liên hệ với chúng tôi</h2>
      <p>
        Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến dữ liệu cá nhân,
        vui lòng liên hệ qua e-mail tại <strong>aczaao12@gmail.com</strong>.
      </p>
    </div>
  );
};

export default PrivacyPolicyView;
