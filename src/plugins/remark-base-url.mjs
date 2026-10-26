// 본문의 '/images/…' 같은 사이트 안 주소에 하위 경로(SITE_BASE)를 붙여 줍니다.
import { visit } from 'unist-util-visit';

export default function remarkBaseUrl(base = '/') {
  const prefix = base.replace(/\/$/, '');
  return (tree) => {
    if (!prefix) return;
    visit(tree, ['image', 'link'], (node) => {
      if (typeof node.url === 'string' && node.url.startsWith('/') && !node.url.startsWith('//') && !node.url.startsWith(prefix + '/')) {
        node.url = prefix + node.url;
      }
    });
  };
}
