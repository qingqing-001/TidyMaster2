// TidyMaster 微信小游戏入口文件
// 这是由Cocos Creator构建生成的应用入口

App({
  onLaunch(options) {
    console.log('[TidyMaster] App onLaunch', options);
    
    // 检查更新
    this.checkUpdate();
  },
  
  onShow(options) {
    console.log('[TidyMaster] App onShow', options);
  },
  
  onHide() {
    console.log('[TidyMaster] App onHide');
  },
  
  onError(err) {
    console.error('[TidyMaster] App onError:', err);
  },
  
  // 检查小程序更新
  checkUpdate() {
    if (typeof wx.getUpdateManager === 'function') {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        console.log('[TidyMaster] Check for update:', res.hasUpdate);
      });
      
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
      
      updateManager.onUpdateFailed(() => {
        wx.showModal({
          title: '更新失败',
          content: '新版本下载失败，请检查网络后重试',
          showCancel: false
        });
      });
    }
  },
  
  // 全局数据
  globalData: {
    userInfo: null,
    systemInfo: null,
    isLoggedIn: false,
    currentLevel: 1,
  }
});