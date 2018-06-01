const storage = {
  key: 'defaultIOKey',
  save: (v, theKey) => {
    if (!theKey) {
      theKey = ioLocal.key;
    }
    const theType = Object.prototype.toString.call(v);
    if (theType === '[object Object]') {
      localStorage.setItem(theKey, JSON.stringify(v));
    } else if (theType === '[object String]') {
      localStorage.setItem(theKey, v);
    } else {
      console.warn('Warn: ioLocal.save() param is no a Object');
    }
  },
  load: theKey => {
    if (!theKey) {
      theKey = ioLocal.key;
    }
    try {
      const data = localStorage.getItem(theKey);
      if (data) {
        if (typeof data === 'string') {
          return JSON.parse(data);
        } else {
          return data;
        }
      }
    } catch (err) {
      console.warn('load last localSate error');
    }
  },
  // 这里做自动保存的监听
  autoSaveStorageKeys: (store, needSaveKeys) => {
    if (Object.prototype.toString.call(needSaveKeys) !== '[object Array]') {
      // eslint-disable-next-line
      console.warn('autoSaveStorageKeys: params不是一个数组');
    }
    // 只有Auth和DataCenter的修改会激发IO;
    const lastDatas = {};
    needSaveKeys.forEach(v => {
      lastDatas[v] = undefined;
    });
    store.subscribe(() => {
      const state = store.getState();
      const nowDatas = {};
      let isNeedSave = false;
      needSaveKeys.forEach(v => {
        // 监听数据和 Immutable 配合做低开销校验
        if (Object.prototype.toString.call(v) === '[object Array]') {
          nowDatas[v] = state.getIn(v);
        }
        nowDatas[v] = state.get(v);
        if (lastDatas[v] !== nowDatas[v]) {
          isNeedSave = true;
        }
      });
      if (isNeedSave) {
        storage.save(nowDatas);
        needSaveKeys.forEach(v => {
          lastDatas[v] = nowDatas[v];
        });
      }
    });
  }
};

export default storage;
