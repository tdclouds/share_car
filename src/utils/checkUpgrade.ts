import { Modal } from 'ant-design-vue';

let cur: string = '';
function checkUpgrade() {
  setTimeout(() => {
    fetch(location.href)
      .then((res) => res.text())
      .then((res) => {
        if (!cur || cur === res) {
          cur = res;
          checkUpgrade();
        } else if (cur !== res) {
          Modal.info({
            title: '页面已更新，需要刷新页面',
            okText() {
              return '刷新';
            },
            onOk() {
              location.reload();
            },
          });
        }
      });
  }, 5000);
}

checkUpgrade();
