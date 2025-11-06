# Welcome to AirDeck 🎤

The future of presentations is here

**Markdown-powered** • **AI-controlled** • **Browser-based**

---

## Headings Showcase

# Heading 1
## Heading 2
### Heading 3

All heading levels are supported with beautiful typography

---

## Text Formatting

**Bold text** for emphasis

*Italic text* for style

***Bold and italic*** combined

~~Strikethrough~~ for corrections

`inline code` for technical terms

---

## Lists - Unordered

- **Markdown-based** slide editor
- **AI-powered** gesture control
  - Swipe right with right hand
  - Swipe left with left hand
- **Browser-based** - no installation needed
- **Hands-free** presentation mode

---

## Lists - Ordered

1. Write your slides in Markdown
2. Preview in real-time
3. Present with gesture controls
4. Navigate with hand swipes
   1. Use gestures
   2. Or use arrow keys
5. Exit with ESC key

---

## Code Blocks

Inline code: `const greeting = "Hello, World!";`

Block code:

```javascript
function createPresentation() {
  const slides = parseMarkdown(content);
  return slides.map(slide =>
    <SlideRenderer markdown={slide} />
  );
}
```

---

## Blockquotes

> "The best presentations are the ones where the speaker can move freely and engage with their audience."

> "AirDeck removes the barrier between you and your audience by eliminating the need for physical clickers."
>
> — Modern Presenter

---

## Tables

| Feature | AirDeck | Traditional Tools |
|---------|---------|-------------------|
| Markdown Support | ✅ Yes | ❌ No |
| Gesture Control | ✅ Yes | ❌ No |
| No Installation | ✅ Yes | ❌ No |
| Live Preview | ✅ Yes | ⚠️ Limited |
| Free & Open Source | ✅ Yes | ❌ No |

---

## Comparison Table

| Aspect | Benefits |
|--------|----------|
| **Speed** | Write slides faster with Markdown |
| **Freedom** | Move freely without holding devices |
| **Cost** | Completely free, no subscriptions |
| **Privacy** | 100% client-side processing |
| **Simplicity** | No complex UI to learn |

---

## Links & References

Check out these resources:

- [React Router Documentation](https://reactrouter.com/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Markdown Guide](https://www.markdownguide.org/)

Visit our repository for more info!

---

## Images

![React Logo](https://react.dev/images/home/conf2021/cover.svg)

Images are fully supported with automatic sizing and centering

---

## Mixed Content

### Why Choose AirDeck?

1. **For Public Speakers**
   - Freedom to move around the stage
   - Natural hand gestures while presenting
   - No need to hold or look for clickers

2. **For Developers**
   - Write presentations in Markdown
   - Version control friendly
   - Fast and efficient workflow

3. **For Educators**
   - Engage students with dynamic movement
   - Focus on teaching, not technology
   - Easy to create and update content

---

## Technical Details

### Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| React Router v7 | Routing |
| TensorFlow.js | ML/AI |
| MoveNet | Pose Detection |
| Tailwind CSS | Styling |

```typescript
interface Presentation {
  slides: string[];
  currentSlide: number;
  gestureEnabled: boolean;
}
```

---

## Gesture Controls

**Swipe Right** (right hand) → Next slide

**Swipe Left** (left hand) → Previous slide

**Arrow Keys** → Fallback navigation

**ESC** → Exit presentation

**Spacebar** → Next slide

---

## Feature Comparison

### What Makes AirDeck Different?

| Feature | Description | Status |
|---------|-------------|--------|
| Markdown Editor | Write slides quickly | ✅ Live |
| Live Preview | See changes instantly | ✅ Live |
| Gesture Control | AI-powered navigation | ✅ Live |
| Keyboard Fallback | Arrow keys always work | ✅ Live |
| Full-screen Mode | Immersive presentation | ✅ Live |
| Error Handling | Graceful degradation | ✅ Live |

---

## Complex Lists

### Nested Lists with Mixed Content

1. **Getting Started**
   - Install dependencies: `npm install`
   - Start dev server: `npm run dev`
   - Open browser at `http://localhost:5173`

2. **Creating Slides**
   - Write Markdown in editor
   - Use `---` to separate slides
   - See live preview on the right

3. **Presenting**
   - Click "Present" button
   - Grant camera permissions
   - Use gestures or keys to navigate

---

## Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Bundle Size | ~2MB | Including TensorFlow.js |
| Load Time | <3s | First load (with cache) |
| FPS | 60fps | Smooth animations |
| Model Size | ~10MB | MoveNet Lightning |
| Detection Latency | <100ms | Real-time response |

---

## Browser Support

### Compatibility Matrix

| Browser | Version | Gesture Support | Status |
|---------|---------|-----------------|--------|
| Chrome | 90+ | ✅ Full | ✅ Recommended |
| Edge | 90+ | ✅ Full | ✅ Supported |
| Firefox | 88+ | ✅ Full | ✅ Supported |
| Safari | 14+ | ⚠️ Slower | ⚠️ Limited |

---

## All Text Styles Together

# Main Title
## Subtitle
### Section

**Bold**, *italic*, ***bold italic***, ~~strikethrough~~, `code`

> Blockquote with *emphasis* and **strong** text

- List with **bold**
- List with *italic*
- List with `code`

[Link text](https://example.com) and inline `code` together

---

## Code Languages

Python example:

```python
def detect_gesture(pose):
    if pose.wrist_right.x > threshold:
        return "swipe_right"
    return None
```

JavaScript example:

```javascript
const gesture = await detector.estimatePoses(video);
if (gesture) handleNavigation(gesture);
```

---

## Thank You! 🙏

### Get Started Now

1. Start writing in the editor
2. Use `---` to create new slides
3. Click **Present** when ready
4. Enjoy hands-free presentations!

---

**Questions?**

*Feel free to explore all the features!*

🌟 Star us on GitHub | 📚 Read the Docs | 💬 Join the Community
