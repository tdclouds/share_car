import { Modal } from 'ant-design-vue';

let scriptName: string = '';

function checkForUpdates() {
  fetch(location.href)
    .then((res) => res.text())
    .then((content) => {
      const matchArray = content.match(/src="\/assets\/(.*?)"/);
      if (scriptName && scriptName !== matchArray?.[1]) {
        Modal.info({
          title: '页面已更新，需要刷新页面',
          okText: '刷新',
          onOk() {
            location.reload();
          },
        });
      } else {
        scriptName = matchArray?.[1] || '';
        setTimeout(checkForUpdates, 60000);
      }
    });
}

checkForUpdates();
