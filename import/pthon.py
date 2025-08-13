# pthon.py
# File này dùng để import dữ liệu từ file JSON vào cơ sở dữ liệu Firestore.

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import json
import os
import re

# Khởi tạo kết nối đến Firebase
# Hàm này sẽ tìm và sử dụng file `serviceAccountKey.json` để xác thực
def initialize_firebase():
    """Khởi tạo và trả về client của Firestore."""
    try:
        # Tìm đường dẫn tuyệt đối đến file serviceAccountKey.json
        cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"Lỗi: Không tìm thấy file 'serviceAccountKey.json' tại {cred_path}")
        
        # Tạo đối tượng xác thực từ file
        cred = credentials.Certificate(cred_path)
        
        # Khởi tạo ứng dụng Firebase
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        
        # Trả về client của Firestore để thao tác với cơ sở dữ liệu
        return firestore.client()
    except Exception as e:
        print(f"❌ Lỗi khi khởi tạo Firebase: {str(e)}")
        # Kết thúc chương trình nếu có lỗi
        exit(1)

# Chức năng phân tích chuỗi thời gian
# Hàm này sẽ cố gắng chuyển đổi các chuỗi thời gian sang đối tượng datetime
def parse_time(time_str):
    """
    Phân tích chuỗi thời gian và trả về đối tượng datetime.
    Hỗ trợ các định dạng: "Vào lúc 13:11:23 05/03/2025" và "2025-03-15".
    """
    if not time_str or not isinstance(time_str, str):
        return None
    
    try:
        # Định dạng thứ nhất: "Vào lúc 13:11:23 05/03/2025"
        if "Vào lúc" in time_str:
            time_part = re.search(r"(\d{2}:\d{2}:\d{2}) (\d{2}/\d{2}/\d{4})", time_str)
            if time_part:
                return datetime.strptime(f"{time_part.group(1)} {time_part.group(2)}", "%H:%M:%S %d/%m/%Y")
        
        # Định dạng thứ hai: "2025-03-15"
        elif re.match(r"\d{4}-\d{2}-\d{2}", time_str):
            return datetime.strptime(time_str, "%Y-%m-%d")
        
        # Trả về None nếu không khớp với định dạng nào
        return None
    except ValueError:
        # Bắt lỗi nếu chuỗi không hợp lệ
        print(f"⚠️ Cảnh báo: Không thể phân tích thời gian từ chuỗi '{time_str}'.")
        return None

# Chức năng import dữ liệu
# Hàm này sẽ đọc file JSON, xử lý dữ liệu và ghi vào Firestore
def import_data(db, json_file_path):
    """Đọc dữ liệu từ file JSON và import vào Firestore."""
    try:
        # Mở và đọc file JSON
        with open(json_file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        # Kiểm tra nếu dữ liệu là một dictionary (tức là chỉ có một document)
        # Chuyển đổi thành list để xử lý đồng nhất
        if isinstance(data, dict):
            data = [data]
        
        # Sử dụng batch write để ghi nhiều document một lúc, hiệu quả hơn
        batch = db.batch()
        
        # Lấy tham chiếu đến collection "activities"
        collection_ref = db.collection("activities")
        
        # Lặp qua từng item trong dữ liệu
        for idx, item in enumerate(data):
            # Tạo document ID. Ưu tiên dùng 'id' có sẵn, nếu không có thì tự tạo
            doc_id = item.get("id", f"doc_{idx}")
            
            # Lấy tham chiếu đến document
            # Cấu trúc: collection/document
            doc_ref = collection_ref.document(doc_id)
            
            # Chuẩn bị dữ liệu để ghi vào Firestore
            activity_data = {
                "Name": item.get("Name", ""),
                "MSSV": item.get("MSSV", ""),
                "Email": item.get("Email", ""),
                "Tên hoạt động": item.get("Tên hoạt động", ""),
                "Điểm cộng": int(item.get("Điểm cộng", 0)),
                "File upload": item.get("File upload", ""),
                "Status": item.get("Status", "Chờ phê duyệt"),
                "Process": item.get("Process", "Sent"),
                # Sử dụng dấu thời gian của server để có thời gian chính xác
                "created_at": firestore.SERVER_TIMESTAMP
            }
            
            # Xử lý trường thời gian
            time_parsed = parse_time(item.get("Thời gian"))
            if time_parsed:
                activity_data["Thời gian"] = time_parsed
            else:
                activity_data["Thời gian"] = firestore.SERVER_TIMESTAMP

            # Thêm thao tác ghi vào batch
            batch.set(doc_ref, activity_data)
        
        # Ghi tất cả các document cùng một lúc
        batch.commit()
        print(f"✅ Đã import thành công {len(data)} documents vào collection 'activities'.")
    except Exception as e:
        print(f"❌ Lỗi khi import dữ liệu: {str(e)}")
        exit(1)

# Điểm khởi đầu của chương trình
if __name__ == "__main__":
    # Đặt đường dẫn đến file JSON của bạn
    json_path = os.path.join(os.path.dirname(__file__), "data.json")
    
    if not os.path.exists(json_path):
        print(f"❌ Lỗi: Không tìm thấy file 'data.json' tại {json_path}")
        exit(1)
    
    # Khởi tạo Firebase và import dữ liệu
    db = initialize_firebase()
    import_data(db, json_path)
