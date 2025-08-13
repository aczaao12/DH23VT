<template>
  <div>
    <h2>Hoạt động của bạn</h2>
    <table>
      <thead>
        <tr>
          <th>Tên hoạt động</th>
          <th>Thời gian</th>
          <th>Điểm cộng</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="activity in activities" :key="activity.id">
          <td>{{ activity['Tên hoạt động'] }}</td>
          <td>{{ activity['Thời gian'] }}</td>
          <td>{{ activity['Điểm cộng'] }}</td>
          <td>{{ activity['Status'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getUserData } from "../services/dataService";
import { auth } from "../firebase";

export default {
  name: "AppDashboard",
  data() {
    return {
      activities: []
    }
  },
  async mounted() {
    const userEmail = auth.currentUser?.email || localStorage.getItem('userEmail');
    if (userEmail) {
      this.activities = await getUserData(userEmail);
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
nav {
  margin: 20px 0;
}
a {
  margin: 0 10px;
  color: #42b983;
  text-decoration: none;
}
button {
  padding: 5px 10px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #cc0000;
}
</style>