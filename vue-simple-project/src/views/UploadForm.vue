<template>
  <div>
    <h2>Upload Tài Liệu Hoạt Động</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Tên hoạt động:</label>
        <input v-model="formData.activityName" required>
      </div>
      
      <div>
        <label>Thời gian:</label>
        <input type="datetime-local" v-model="formData.time" required>
      </div>
      
      <div>
        <label>File minh chứng:</label>
        <input type="file" @change="handleFileChange" required>
      </div>
      
      <button type="submit">Gửi</button>
    </form>
  </div>
</template>

<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage, auth } from "../firebase";

export default {
  name: "AppUploadForm",
  data() {
    return {
      formData: {
        activityName: "",
        time: "",
        file: null
      }
    }
  },
  methods: {
    handleFileChange(e) {
      this.formData.file = e.target.files[0];
    },
    async handleSubmit() {
      try {
        // Upload file lên Storage
        const storageRef = ref(storage, `proofs/${this.formData.file.name}`);
        await uploadBytes(storageRef, this.formData.file);
        const fileUrl = await getDownloadURL(storageRef);

        // Lưu dữ liệu vào Firestore
        await addDoc(collection(db, "activities"), {
          "Thời gian": new Date(this.formData.time).toLocaleString(),
          "Name": auth.currentUser.displayName || "Người dùng",
          "Email": auth.currentUser.email,
          "Tên hoạt động": this.formData.activityName,
          "Điểm cộng": 0, // Mặc định 0, admin sẽ cập nhật sau
          "File upload": fileUrl,
          "Status": "Chờ phê duyệt",
          "Process": "Sent"
        });

        alert("Gửi thành công!");
        this.$router.push("/dashboard");
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    }
  }
}
</script>

<style scoped>
.upload-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
form div {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input[type="file"] {
  display: block;
  margin-top: 5px;
}
textarea {
  width: 100%;
  height: 100px;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #369f6e;
}
.status-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>