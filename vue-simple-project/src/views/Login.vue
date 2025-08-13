import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

<template>
  <div class="login">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Tên đăng nhập:</label>
        <input type="text" v-model="username" required>
      </div>
      <div>
        <label>Mật khẩu:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Đăng nhập</button>
    </form>
  </div>
</template>

<script>
export default {
   name: 'AppLogin', // Thêm tiền tố App

  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          this.email, 
          this.password
        );
        
        // Lưu thông tin đăng nhập
        localStorage.setItem('userEmail', this.email);
        this.$router.push('/dashboard');
      } catch (error) {
        alert('Sai email hoặc mật khẩu: ' + error.message);
      }
    }
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.login div {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
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
</style>