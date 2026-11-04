(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.lineIllustration = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  const number = value => String(Number(value.toFixed(2)));
  const percent = fraction => number(fraction * 100) + '%';
  const extent = fraction => (fraction * 100) + '%';
  const values = channels => channels.map(number).join(', ');
  const color = channels => 'rgb(' + values(channels) + ')';

  function render(host, visual) {
    if (!host) return null;
    const doc = host.ownerDocument;
    function node(tag, className, text) {
      const element = doc.createElement(tag);
      if (className) element.className = 'li-' + className;
      if (text !== undefined) element.textContent = text;
      return element;
    }
    function decoration(tag, className) {
      const element = node(tag, className);
      element.setAttribute('aria-hidden', 'true');
      return element;
    }
    function bar(fraction, tone) {
      const track = decoration('span', 'track');
      const fill = node('span', 'fill');
      fill.style.width = extent(fraction);
      if (tone) fill.style.backgroundColor = tone;
      track.append(fill);
      return track;
    }
    function colorKey(label, channels) {
      const key = node('div', 'color-key');
      const chip = decoration('span', 'chip');
      chip.style.backgroundColor = color(channels);
      key.append(chip, node('strong', '', label), node('span', 'numbers', values(channels)));
      return key;
    }

    const figure = node('figure', 'figure');
    const caption = title => figure.append(node('figcaption', 'caption', title));
    const note = text => node('p', 'note', text);

    switch (visual?.type) {
      case 'amount': {
        caption('Color change');
        figure.append(node('p', 'reading', visual.label + ' = ' + number(visual.value) + ' · ' + percent(visual.value)),
          bar(visual.value), note('0 keeps the original color. 1 reaches the target color.'));
        break;
      }
      case 'region': {
        caption('Across the source picture');
        const map = decoration('div', 'region');
        const keep = node('span', 'keep');
        keep.style.width = extent(visual.fraction);
        const boundary = node('span', 'boundary');
        boundary.style.left = extent(visual.fraction);
        const sample = node('span', 'sample');
        sample.style.left = extent(visual.position);
        map.append(keep, boundary, sample);
        figure.append(map, node('p', 'rule-reading', 'Rule boundary at ' + percent(visual.fraction)),
          note('Before the boundary, keep the original color. At or after it, apply the rule.'),
          node('p', 'sample-reading', 'Selected sample at ' + percent(visual.position) + ' → ' + (visual.changes ? 'apply the rule.' : 'keep the original color.')));
        break;
      }
      case 'call': {
        caption('Pass a number');
        const path = node('div', 'path');
        function step(label, name, value) {
          const box = node('div', 'step');
          box.append(node('small', '', label), node('code', '', name));
          if (value !== undefined) box.append(node('strong', '', number(value)));
          return box;
        }
        function arrow() {
          const element = decoration('span', 'arrow');
          element.textContent = '→';
          return element;
        }
        path.append(step('Send', visual.argumentName, visual.value), arrow(), step('Call', 'paintTiles'),
          arrow(), step('Receive', visual.parameterName, visual.value));
        figure.append(path);
        break;
      }
      case 'layers': {
        caption('Paint in order');
        const base = decoration('div', 'layers');
        const block = node('span', 'layer-block');
        base.style.backgroundColor = color(visual.background);
        block.style.backgroundColor = color(visual.block);
        base.append(block);
        figure.append(base, note('1. Background · ' + values(visual.background)),
          note('2. Sample block on top · ' + values(visual.block)));
        break;
      }
      case 'gray': {
        caption('Average the three channels');
        const groups = node('div', 'channels');
        function channelGroup(label, channels) {
          const group = node('div', 'channel-group');
          group.append(node('strong', '', label));
          const names = ['Red', 'Green', 'Blue'];
          const tones = ['#ef9e9e', '#a5d8a3', '#9dd8eb'];
          channels.forEach((value, i) => {
            const row = node('div', 'channel');
            row.append(node('span', '', names[i] + ' ' + number(value)), bar(value / 255, tones[i]));
            group.append(row);
          });
          return group;
        }
        groups.append(channelGroup('Original', visual.original), channelGroup('Gray target', Array(3).fill(visual.gray)));
        figure.append(note('(' + visual.original.map(number).join(' + ') + ') ÷ 3 = ' + number(visual.gray)),
          groups, note('Each bar runs from 0 to 255.'));
        break;
      }
      case 'blend': {
        caption('Mix the colors');
        const keys = node('div', 'blend');
        keys.append(colorKey('From', visual.original), colorKey('Now', visual.current), colorKey('Target', visual.target));
        figure.append(keys, note('Change amount ' + number(visual.value) + ' · ' + percent(visual.value)), bar(visual.value));
        break;
      }
      case 'position': {
        caption('Place one rectangle');
        const {x, y, w, h, canvasW, canvasH, rgb} = visual;
        const plane = decoration('div', 'plane');
        plane.style.aspectRatio = canvasW + ' / ' + canvasH;
        const block = node('span', 'rectangle');
        block.style.left = extent(x / canvasW);
        block.style.top = extent(y / canvasH);
        block.style.width = extent(w / canvasW);
        block.style.height = extent(h / canvasH);
        block.style.backgroundColor = color(rgb);
        plane.append(block);
        figure.append(plane, note('At (' + number(x) + ', ' + number(y) + ') · block ' + number(w) + ' × ' + number(h)),
          note('Teaching canvas ' + canvasW + ' × ' + canvasH + ' · RGB ' + values(rgb)));
        break;
      }
      default:
        host.replaceChildren();
        return null;
    }
    host.replaceChildren(figure);
    return figure;
  }
  return {render};
});
