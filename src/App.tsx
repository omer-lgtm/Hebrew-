import { Editor } from './components/Editor';
import { Visualizer } from './components/Visualizer';
import { useStore } from './store';
import './index.css';

function App() {
  const isVisualizerOpen = useStore((state) => state.isVisualizerOpen);

  return (
    <div className="layout-container">
      <div className="editor-section glass-panel animate-fade-in">
        <Editor />
      </div>
      
      <div className={`visualizer-section glass-panel ${isVisualizerOpen ? 'open' : ''}`}>
        {isVisualizerOpen && <Visualizer />}
      </div>
    </div>
  );
}

export default App;
