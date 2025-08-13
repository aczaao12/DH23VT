<template>
  <div class="notifications">
    <h2>Thông báo</h2>
    <router-link to="/dashboard">Quay lại Dashboard</router-link>
    
    <div class="notification-list">
      <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
        <h3>{{ notification.title }}</h3>
        <p>{{ notification.message }}</p>
        <small>{{ notification.date }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNotification',
  data() {
    return {
      notifications: [
        {
          title: 'Thông báo 1',
          message: 'Đây là thông báo quan trọng đầu tiên',
          date: '2023-05-01'
        },
        {
          title: 'Thông báo 2',
          message: 'Đây là thông báo quan trọng thứ hai',
          date: '2023-05-02'
        },
        {
          title: 'Thông báo 3',
          message: 'Đây là thông báo quan trọng thứ ba',
          date: '2023-05-03'
        }
      ]
    }
  }
}
</script>

<style scoped>
.notifications {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.notification-list {
  margin-top: 20px;
}
.notification-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.notification-item h3 {
  margin-top: 0;
  color: #42b983;
}
.notification-item small {
  color: #888;
}
</style>