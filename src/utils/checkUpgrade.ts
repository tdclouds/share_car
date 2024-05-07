import { Modal } from 'ant-design-vue';

let content: string = '';

function checkForUpdates() {
  fetch(location.href)
    .then((res) => res.text())
    .then((newContent) => {
      if (content && content !== newContent) {
        Modal.info({
          title: '页面已更新，需要刷新页面',
          okText: '刷新',
          onOk: location.reload,
        });
      } else {
        content = newContent;
        setTimeout(checkForUpdates, 60000);
      }
    });
}

checkForUpdates();
