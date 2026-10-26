// 본문 안에서 쓰는 간단한 상자 문법.
//
//   :::tmi[바실레이아가 뭐예요?]
//   내용…
//   :::
//
// 위처럼 쓰면 "TMI" 상자가 됩니다. 제목([ ] 부분)은 생략해도 됩니다.
// TMI 상자는 기본으로 접혀 있고, 제목을 누르면 펼쳐집니다(<details>).
// 그 밖의 ':단어' 같은 글자는 원래 글자 그대로 둡니다(실수로 사라지지 않게).
import { visit } from 'unist-util-visit';

const BOXES = {
  tmi: { className: 'box box-tmi', label: 'TMI', fold: true },
};

export default function remarkLessonBlocks() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'containerDirective' && BOXES[node.name]) {
        const box = BOXES[node.name];
        let title = null;
        const first = node.children[0];
        if (first && first.data && first.data.directiveLabel) {
          title = first.children;
          node.children.shift();
        }
        const label = {
          type: 'paragraph',
          data: { hName: box.fold ? 'summary' : 'p', hProperties: { className: 'box-label' } },
          children: [
            { type: 'text', value: box.label },
            ...(title ? [{ type: 'text', value: ' · ' }, ...title] : []),
          ],
        };
        node.children.unshift(label);
        node.data = { hName: box.fold ? 'details' : 'aside', hProperties: { className: box.className } };
        return;
      }
      // 모르는 지시어는 원래 글자로 되돌림
      if (
        parent &&
        typeof index === 'number' &&
        (node.type === 'textDirective' || node.type === 'leafDirective' || node.type === 'containerDirective')
      ) {
        const prefix = node.type === 'textDirective' ? ':' : node.type === 'leafDirective' ? '::' : ':::';
        const replacement = [{ type: 'text', value: prefix + node.name }, ...(node.children || [])];
        if (node.type === 'textDirective') {
          parent.children.splice(index, 1, ...replacement);
        } else if (node.type === 'leafDirective') {
          parent.children.splice(index, 1, { type: 'paragraph', children: replacement });
        } else {
          parent.children.splice(
            index,
            1,
            { type: 'paragraph', children: [{ type: 'text', value: prefix + node.name }] },
            ...(node.children || []),
          );
        }
        return index;
      }
    });
  };
}
