const express = require('express');
const router = express.Router();
const PptxGenJS = require('pptxgenjs');
const axios = require('axios');

// Helper to embed background image into slide
async function addSlideImage(pSlide, imageUrl) {
  if (!imageUrl) return;
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 6000
    });
    const imageData = Buffer.from(response.data).toString('base64');
    const isJpeg = imageUrl.includes('.jpg') || imageUrl.includes('jpeg') || imageUrl.includes('photo');
    const mimeType = isJpeg ? 'jpeg' : 'png';
    pSlide.addImage({
      data: `data:image/${mimeType};base64,${imageData}`,
      x: 0, y: 0, w: 13.33, h: 7.5,
      sizing: { type: 'cover' },
      transparency: 82
    });
  } catch (e) {
    // Skip image silently if fails
  }
}

router.post('/', async (req, res) => {
  const { slides, deckTitle, theme } = req.body;

  if (!slides || slides.length === 0) {
    return res.status(400).json({ error: 'No slides provided' });
  }

  try {
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'FULLSCREEN', width: 13.33, height: 7.5 });
    pptx.layout = 'FULLSCREEN';
    pptx.title = deckTitle || 'ForGenZ Presentation';

    const themes = {
      'dark-tech':    { bg: '0D1117', accent: '00D2FF', accent2: '6C5CE7', text: 'E6F1FF', muted: '8B9CBB', surface: '161B27' },
      'ocean-blue':   { bg: '020B18', accent: '00E5FF', accent2: '0070F3', text: 'E0F7FF', muted: '7BA5BB', surface: '041525' },
      'forest-green': { bg: '0A1A0F', accent: '00E676', accent2: '69F0AE', text: 'E8F5E9', muted: '7AAB80', surface: '0F2518' },
      'sunset-warm':  { bg: '1A0A00', accent: 'FF6B35', accent2: 'FFB300', text: 'FFF3E0', muted: 'BB8A70', surface: '271200' },
      'royal-purple': { bg: '0D0520', accent: '9C27B0', accent2: 'E040FB', text: 'F3E5F5', muted: '9B7AAB', surface: '180A35' },
      'corporate-blue': { bg: '0A1628', accent: '2196F3', accent2: '64B5F6', text: 'E3F2FD', muted: '90A4AE', surface: '112240' },
      'neon-dark':    { bg: '050510', accent: '00FF88', accent2: 'FF00FF', text: 'F0F0FF', muted: '8080AA', surface: '0A0A20' },
      'golden-luxury':{ bg: '0A0800', accent: 'FFD700', accent2: 'FFA000', text: 'FFFDE7', muted: 'BB9A50', surface: '181200' },
      'academic-white':{ bg: 'F5F5F5', accent: '1565C0', accent2: '0D47A1', text: '1A1A2E', muted: '546E7A', surface: 'E8EAF6' },
      'minimal':      { bg: 'FFFFFF', accent: '6C5CE7', accent2: '4A4E69', text: '1A1A2E', muted: '6B7280', surface: 'F5F5F7' },
    };

    const t = themes[theme] || themes['dark-tech'];

    const chartColors = [
      t.accent, t.accent2,
      'FF6B6B', 'FFB300', '00E676',
      'FF79C6', '69F0AE', 'FFD54F'
    ];

    const W = 13.33;
    const H = 7.5;

    // Process all slides
    for (const slide of slides) {
      const pSlide = pptx.addSlide();
      pSlide.background = { color: t.bg };

      // Add background image if available
      if (slide.bgImage) {
        await addSlideImage(pSlide, slide.bgImage);
      }

      // Slide number badge
      pSlide.addText(`${slide.num}`, {
        x: 0.2, y: 0.1, w: 0.4, h: 0.28,
        fontSize: 9, color: t.muted, align: 'left'
      });

      // Type badge
      pSlide.addText((slide.type || '').toUpperCase(), {
        x: W - 1.6, y: 0.1, w: 1.4, h: 0.28,
        fontSize: 8, color: t.accent, align: 'right'
      });

      // ── TITLE ──
      if (slide.type === 'title') {
        pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.1, h: H, fill: { color: t.accent } });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: t.bg + 'CC' } });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.1, h: H, fill: { color: t.accent } });
        pSlide.addText(slide.heading || '', {
          x: 0.8, y: 1.6, w: W - 1.4, h: 2.5,
          fontSize: 52, bold: true, color: t.text,
          fontFace: 'Arial', align: 'left', wrap: true
        });
        pSlide.addText(slide.subheading || slide.body || '', {
          x: 0.8, y: 4.3, w: W - 1.4, h: 1.0,
          fontSize: 22, color: t.muted,
          fontFace: 'Arial', align: 'left'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 5.5, w: 3.0, h: 0.07, fill: { color: t.accent } });
      }

      // ── OVERVIEW / BULLETS ──
      else if (slide.type === 'overview' || slide.type === 'bullets') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        const items = slide.items || [];
        items.forEach((item, i) => {
          pSlide.addShape(pptx.ShapeType.ellipse, {
            x: 0.6, y: 1.75 + i * 0.82, w: 0.14, h: 0.14,
            fill: { color: t.accent }
          });
          pSlide.addText(item, {
            x: 0.9, y: 1.65 + i * 0.82, w: W - 1.4, h: 0.65,
            fontSize: 17, color: t.text, fontFace: 'Arial', wrap: true
          });
        });
      }

      // ── STATS ──
      else if (slide.type === 'stats') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        const stats = slide.stats || [];
        const total = stats.length;
        const boxW = Math.min(3.5, ((W - 1.0) / total) - 0.3);
        const totalW = total * boxW + (total - 1) * 0.3;
        const startX = (W - totalW) / 2;
        stats.forEach((stat, i) => {
          const x = startX + i * (boxW + 0.3);
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x, y: 1.8, w: boxW, h: 3.5,
            fill: { color: t.surface }, line: { color: t.accent, width: 1.5 }, rectRadius: 0.1
          });
          pSlide.addText(stat.value, {
            x, y: 2.4, w: boxW, h: 1.2,
            fontSize: 42, bold: true, color: t.accent, fontFace: 'Arial', align: 'center'
          });
          pSlide.addText(stat.label, {
            x, y: 3.8, w: boxW, h: 0.8,
            fontSize: 16, color: t.muted, fontFace: 'Arial', align: 'center', wrap: true
          });
        });
      }

      // ── PIE CHART ──
      else if (slide.type === 'piechart') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        const labels = slide.chartData?.labels || [];
        const values = slide.chartData?.values || [];
        if (labels.length > 0 && values.length > 0) {
          pSlide.addChart(pptx.ChartType.pie, [{
            name: slide.heading || 'Data', labels, values
          }], {
            x: 1.5, y: 1.4, w: 10, h: 5.5,
            chartColors: chartColors.slice(0, labels.length),
            showLegend: true, legendPos: 'r', legendColor: t.text,
            showValue: true, dataLabelColor: 'FFFFFF',
            dataLabelFontSize: 14, dataLabelFontBold: true,
          });
        }
      }

      // ── BAR CHART ──
      else if (slide.type === 'barchart') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        const labels = slide.chartData?.labels || [];
        const values = slide.chartData?.values || [];
        if (labels.length > 0 && values.length > 0) {
          pSlide.addChart(pptx.ChartType.bar, [{
            name: slide.heading || 'Data', labels, values
          }], {
            x: 0.6, y: 1.4, w: W - 1.0, h: 5.5,
            chartColors: [t.accent],
            showLegend: false, showValue: true,
            dataLabelColor: t.text, dataLabelFontSize: 12,
            valAxisLabelColor: t.muted, catAxisLabelColor: t.muted,
            barGapWidthPct: 50,
          });
        }
      }

      // ── DONUT CHART ──
      else if (slide.type === 'donut') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        const labels = slide.chartData?.labels || [];
        const values = slide.chartData?.values || [];
        if (labels.length > 0 && values.length > 0) {
          pSlide.addChart(pptx.ChartType.doughnut, [{
            name: slide.heading || 'Data', labels, values
          }], {
            x: 1.5, y: 1.4, w: 7, h: 5.5,
            chartColors: chartColors.slice(0, labels.length),
            showLegend: true, legendPos: 'r', legendColor: t.text,
            holeSize: 60, showValue: true,
            dataLabelColor: 'FFFFFF', dataLabelFontSize: 14,
          });
        }
        if (slide.centerValue) {
          pSlide.addText(slide.centerValue, {
            x: 3.2, y: 3.5, w: 3.0, h: 0.9,
            fontSize: 32, bold: true, color: t.text, fontFace: 'Arial', align: 'center'
          });
          if (slide.centerLabel) {
            pSlide.addText(slide.centerLabel, {
              x: 3.2, y: 4.3, w: 3.0, h: 0.5,
              fontSize: 14, color: t.muted, fontFace: 'Arial', align: 'center'
            });
          }
        }
      }

      // ── TIMELINE ──
      else if (slide.type === 'timeline') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 1.0, y: 1.5, w: 0.05, h: 5.2, fill: { color: t.accent + '60' } });
        const items = slide.items || [];
        items.forEach((item, i) => {
          const y = 1.6 + i * (5.0 / Math.max(items.length, 1));
          pSlide.addShape(pptx.ShapeType.ellipse, { x: 0.82, y: y, w: 0.36, h: 0.36, fill: { color: t.accent } });
          pSlide.addText(`${item.year}`, { x: 1.4, y: y - 0.05, w: 1.5, h: 0.4, fontSize: 15, bold: true, color: t.accent, fontFace: 'Arial' });
          pSlide.addText(item.title, { x: 3.1, y: y - 0.05, w: W - 3.6, h: 0.4, fontSize: 17, bold: true, color: t.text, fontFace: 'Arial' });
          pSlide.addText(item.body || '', { x: 3.1, y: y + 0.38, w: W - 3.6, h: 0.38, fontSize: 14, color: t.muted, fontFace: 'Arial' });
        });
      }

      // ── COMPARISON ──
      else if (slide.type === 'comparison') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        const halfW = (W - 1.0) / 2 - 0.2;
        pSlide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: 1.5, w: halfW, h: 5.3, fill: { color: '2D1A1A' }, line: { color: 'FF6B6B', width: 1.5 }, rectRadius: 0.1 });
        pSlide.addText(slide.col1?.title || 'Before', { x: 0.4, y: 1.6, w: halfW, h: 0.6, fontSize: 20, bold: true, color: 'FF6B6B', fontFace: 'Arial', align: 'center' });
        (slide.col1?.items || []).forEach((item, i) => {
          pSlide.addShape(pptx.ShapeType.ellipse, { x: 0.65, y: 2.5 + i * 0.85, w: 0.12, h: 0.12, fill: { color: 'FF6B6B' } });
          pSlide.addText(item, { x: 0.9, y: 2.42 + i * 0.85, w: halfW - 0.6, h: 0.6, fontSize: 15, color: t.text, fontFace: 'Arial', wrap: true });
        });
        const rightX = W / 2 + 0.2;
        pSlide.addShape(pptx.ShapeType.roundRect, { x: rightX, y: 1.5, w: halfW, h: 5.3, fill: { color: '1A2D1A' }, line: { color: '00E676', width: 1.5 }, rectRadius: 0.1 });
        pSlide.addText(slide.col2?.title || 'After', { x: rightX, y: 1.6, w: halfW, h: 0.6, fontSize: 20, bold: true, color: '00E676', fontFace: 'Arial', align: 'center' });
        (slide.col2?.items || []).forEach((item, i) => {
          pSlide.addShape(pptx.ShapeType.ellipse, { x: rightX + 0.25, y: 2.5 + i * 0.85, w: 0.12, h: 0.12, fill: { color: '00E676' } });
          pSlide.addText(item, { x: rightX + 0.5, y: 2.42 + i * 0.85, w: halfW - 0.6, h: 0.6, fontSize: 15, color: t.text, fontFace: 'Arial', wrap: true });
        });
      }

      // ── PROCESS ──
      else if (slide.type === 'process') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        const steps = slide.steps || [];
        const boxW = ((W - 1.0) / steps.length) - 0.3;
        steps.forEach((step, i) => {
          const x = 0.6 + i * (boxW + 0.3);
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x, y: 1.6, w: boxW, h: 4.5,
            fill: { color: t.surface }, line: { color: t.accent, width: 1.5 }, rectRadius: 0.1
          });
          pSlide.addShape(pptx.ShapeType.ellipse, {
            x: x + boxW / 2 - 0.35, y: 1.8, w: 0.7, h: 0.7,
            fill: { color: t.accent }
          });
          pSlide.addText(step.num, {
            x: x + boxW / 2 - 0.35, y: 1.85, w: 0.7, h: 0.6,
            fontSize: 14, bold: true, color: '000000', fontFace: 'Arial', align: 'center'
          });
          pSlide.addText(step.title, {
            x, y: 2.65, w: boxW, h: 0.6,
            fontSize: 15, bold: true, color: t.text, fontFace: 'Arial', align: 'center'
          });
          pSlide.addText(step.body || '', {
            x: x + 0.1, y: 3.35, w: boxW - 0.2, h: 2.5,
            fontSize: 13, color: t.muted, fontFace: 'Arial', align: 'center', wrap: true
          });
          if (i < steps.length - 1) {
            pSlide.addText('→', {
              x: x + boxW, y: 3.5, w: 0.3, h: 0.5,
              fontSize: 20, color: t.muted, fontFace: 'Arial', align: 'center'
            });
          }
        });
      }

      // ── BLOCKS ──
      else if (slide.type === 'blocks') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        const blocks = slide.blocks || [];
        const halfW = (W - 1.0) / 2 - 0.2;
        blocks.slice(0, 4).forEach((block, i) => {
          const x = i % 2 === 0 ? 0.4 : W / 2 + 0.2;
          const y = i < 2 ? 1.5 : 4.0;
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x, y, w: halfW, h: 2.2,
            fill: { color: t.surface }, line: { color: t.accent2, width: 1 }, rectRadius: 0.1
          });
          pSlide.addText(block.icon || '●', { x: x + 0.2, y: y + 0.2, w: 0.7, h: 0.6, fontSize: 26, fontFace: 'Arial' });
          pSlide.addText(block.title || '', { x: x + 0.9, y: y + 0.2, w: halfW - 1.1, h: 0.55, fontSize: 16, bold: true, color: t.text, fontFace: 'Arial' });
          pSlide.addText(block.body || '', { x: x + 0.9, y: y + 0.8, w: halfW - 1.1, h: 1.1, fontSize: 13, color: t.muted, fontFace: 'Arial', wrap: true });
        });
      }

      // ── QUOTE ──
      else if (slide.type === 'quote') {
        pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.6, h: H, fill: { color: t.accent } });
        pSlide.addText('"', { x: 0.9, y: 0.3, w: 2.0, h: 2.0, fontSize: 120, color: t.accent, fontFace: 'Arial', bold: true });
        pSlide.addText(slide.quote || '', {
          x: 0.9, y: 1.8, w: W - 1.5, h: 3.5,
          fontSize: 26, color: t.text, fontFace: 'Arial', italic: true,
          align: 'left', wrap: true, lineSpacingMultiple: 1.5
        });
        pSlide.addText(slide.attribution || '', {
          x: 0.9, y: 5.5, w: W - 1.5, h: 0.6,
          fontSize: 16, color: t.muted, fontFace: 'Arial', align: 'left'
        });
      }

      // ── SWOT ──
      else if (slide.type === 'swot') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        const swotBoxes = [
          { key: 'strengths', label: 'STRENGTHS', color: '00E676', bg: '0A2D1A', x: 0.4, y: 1.5 },
          { key: 'weaknesses', label: 'WEAKNESSES', color: 'FF6B6B', bg: '2D0A0A', x: W / 2 + 0.1, y: 1.5 },
          { key: 'opportunities', label: 'OPPORTUNITIES', color: '00D2FF', bg: '0A1A2D', x: 0.4, y: 4.1 },
          { key: 'threats', label: 'THREATS', color: 'FFB300', bg: '2D1A0A', x: W / 2 + 0.1, y: 4.1 },
        ];
        const boxW = (W - 1.0) / 2 - 0.2;
        swotBoxes.forEach(({ key, label, color, bg, x, y }) => {
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x, y, w: boxW, h: 2.5,
            fill: { color: bg }, line: { color, width: 1.5 }, rectRadius: 0.1
          });
          pSlide.addShape(pptx.ShapeType.rect, { x, y, w: boxW, h: 0.45, fill: { color: color + '40' } });
          pSlide.addText(label, {
            x, y: y + 0.04, w: boxW, h: 0.38,
            fontSize: 12, bold: true, color, fontFace: 'Arial', align: 'center'
          });
          const items = (slide[key] || []).slice(0, 3);
          items.forEach((item, i) => {
            pSlide.addShape(pptx.ShapeType.ellipse, { x: x + 0.18, y: y + 0.6 + i * 0.58, w: 0.1, h: 0.1, fill: { color } });
            pSlide.addText(item, {
              x: x + 0.35, y: y + 0.53 + i * 0.58, w: boxW - 0.45, h: 0.52,
              fontSize: 13, color: t.text, fontFace: 'Arial', wrap: true
            });
          });
        });
      }

      // ── ROADMAP ──
      else if (slide.type === 'roadmap') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        // Connecting line
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 2.12, w: W - 1.6, h: 0.06, fill: { color: t.accent + '50' } });
        const phases = slide.phases || [];
        const phaseW = Math.min(3.0, (W - 1.2) / Math.max(phases.length, 1));
        phases.forEach((phase, i) => {
          const x = 0.6 + i * phaseW;
          // Circle marker
          pSlide.addShape(pptx.ShapeType.ellipse, {
            x: x + phaseW / 2 - 0.32, y: 1.83, w: 0.64, h: 0.64,
            fill: { color: t.accent }
          });
          pSlide.addText(`${i + 1}`, {
            x: x + phaseW / 2 - 0.32, y: 1.87, w: 0.64, h: 0.56,
            fontSize: 14, bold: true, color: '000000', fontFace: 'Arial', align: 'center'
          });
          // Phase box
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x: x + 0.1, y: 2.65, w: phaseW - 0.2, h: 4.4,
            fill: { color: t.surface }, line: { color: t.accent, width: 1 }, rectRadius: 0.1
          });
          pSlide.addText(phase.period || '', {
            x: x + 0.18, y: 2.8, w: phaseW - 0.36, h: 0.4,
            fontSize: 11, bold: true, color: t.accent, fontFace: 'Arial'
          });
          pSlide.addText(phase.title || '', {
            x: x + 0.18, y: 3.25, w: phaseW - 0.36, h: 0.55,
            fontSize: 13, bold: true, color: t.text, fontFace: 'Arial', wrap: true
          });
          (phase.items || []).slice(0, 3).forEach((item, j) => {
            pSlide.addShape(pptx.ShapeType.ellipse, { x: x + 0.22, y: 3.95 + j * 0.55, w: 0.1, h: 0.1, fill: { color: t.accent } });
            pSlide.addText(item, {
              x: x + 0.38, y: 3.88 + j * 0.55, w: phaseW - 0.55, h: 0.48,
              fontSize: 11, color: t.muted, fontFace: 'Arial', wrap: true
            });
          });
        });
      }

      // ── FUNNEL ──
      else if (slide.type === 'funnel') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        const stages = slide.stages || [];
        const colors = [t.accent, t.accent2, '00E676', 'FFB300', 'FF6B6B'];
        stages.forEach((stage, i) => {
          const stageW = (W - 1.0) * (1 - i * 0.1);
          const x = (W - stageW) / 2;
          const y = 1.6 + i * 1.1;
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x, y, w: stageW, h: 0.88,
            fill: { color: colors[i % colors.length] + '28' },
            line: { color: colors[i % colors.length], width: 1.5 },
            rectRadius: 0.08
          });
          pSlide.addText(stage.label || '', {
            x: x + 0.3, y: y + 0.14, w: stageW * 0.55, h: 0.6,
            fontSize: 17, bold: true, color: colors[i % colors.length], fontFace: 'Arial'
          });
          pSlide.addText(stage.value || '', {
            x: x + stageW * 0.55, y: y + 0.1, w: stageW * 0.38, h: 0.68,
            fontSize: 22, bold: true, color: t.text, fontFace: 'Arial', align: 'right'
          });
        });
      }

      // ── HUB & SPOKE ──
      else if (slide.type === 'hubspoke') {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        const cx = W / 2;
        const cy = 4.6;
        // Center hub
        pSlide.addShape(pptx.ShapeType.ellipse, {
          x: cx - 1.0, y: cy - 0.65, w: 2.0, h: 1.3,
          fill: { color: t.accent }
        });
        pSlide.addText(slide.center || 'Core', {
          x: cx - 1.0, y: cy - 0.45, w: 2.0, h: 0.9,
          fontSize: 15, bold: true, color: '000000', fontFace: 'Arial', align: 'center'
        });
        const spokes = (slide.spokes || []).slice(0, 6);
        spokes.forEach((spoke, i) => {
          const angle = (i / spokes.length) * 2 * Math.PI - Math.PI / 2;
          const r = 2.6;
          const sx = cx + r * Math.cos(angle);
          const sy = cy + r * 0.7 * Math.sin(angle);
          // Spoke line
          pSlide.addShape(pptx.ShapeType.line, {
            x: Math.min(cx, sx), y: Math.min(cy, sy),
            w: Math.abs(sx - cx) || 0.01,
            h: Math.abs(sy - cy) || 0.01,
            line: { color: t.accent + '60', width: 1.5 }
          });
          // Spoke box
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x: sx - 1.0, y: sy - 0.3, w: 2.0, h: 0.6,
            fill: { color: t.surface }, line: { color: t.accent, width: 1 }, rectRadius: 0.08
          });
          pSlide.addText(spoke, {
            x: sx - 1.0, y: sy - 0.25, w: 2.0, h: 0.5,
            fontSize: 12, color: t.text, fontFace: 'Arial', align: 'center'
          });
        });
      }

      // ── CLOSING ──
      else if (slide.type === 'closing') {
        pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: t.bg } });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.1, fill: { color: t.accent } });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: H - 0.1, w: W, h: 0.1, fill: { color: t.accent } });
        pSlide.addShape(pptx.ShapeType.ellipse, {
          x: W / 2 - 0.5, y: 1.2, w: 1.0, h: 1.0,
          fill: { color: t.accent }
        });
        pSlide.addText('✓', {
          x: W / 2 - 0.5, y: 1.3, w: 1.0, h: 0.8,
          fontSize: 28, bold: true, color: '000000', fontFace: 'Arial', align: 'center'
        });
        pSlide.addText(slide.heading || 'Thank You', {
          x: 0.6, y: 2.4, w: W - 1.0, h: 1.8,
          fontSize: 56, bold: true, color: t.text, fontFace: 'Arial', align: 'center'
        });
        pSlide.addShape(pptx.ShapeType.rect, {
          x: (W - 4) / 2, y: 4.3, w: 4, h: 0.07,
          fill: { color: t.accent }
        });
        pSlide.addText(slide.body || '', {
          x: 0.6, y: 4.5, w: W - 1.0, h: 0.7,
          fontSize: 20, color: t.muted, fontFace: 'Arial', align: 'center'
        });
        (slide.items || []).forEach((item, i) => {
          pSlide.addText(item, {
            x: 0.6, y: 5.35 + i * 0.52, w: W - 1.0, h: 0.48,
            fontSize: 16, color: t.accent, fontFace: 'Arial', align: 'center'
          });
        });
      }

      // ── DEFAULT ──
      else {
        pSlide.addText(slide.heading || '', {
          x: 0.6, y: 0.4, w: W - 1.0, h: 0.9,
          fontSize: 34, bold: true, color: t.text, fontFace: 'Arial'
        });
        pSlide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 2.2, h: 0.06, fill: { color: t.accent } });
        pSlide.addText(
          slide.body || (slide.items || []).join('\n') || '', {
          x: 0.6, y: 1.6, w: W - 1.0, h: 5.3,
          fontSize: 18, color: t.text, fontFace: 'Arial', wrap: true, lineSpacingMultiple: 1.5
        });
      }
    }

    const buffer = await pptx.write({ outputType: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${(deckTitle || 'ForGenZ').replace(/[^a-zA-Z0-9]/g, '_')}.pptx"`);
    res.send(buffer);

  } catch (e) {
    console.error('Export error:', e.message);
    res.status(500).json({ error: 'Export failed: ' + e.message });
  }
});

module.exports = router;