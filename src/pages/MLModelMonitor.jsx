import { Brain, Activity, Target, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { modelMetrics, trainingHistory, confusionMatrix, featureImportance } from '../data/mockData';

export default function MLModelMonitor() {
  return (
    <div className="animate-in stagger-1">
      <div className="page-header">
        <h2>ML Model Monitor</h2>
        <p>Adaptive model performance, metrics tracking, and feature importance</p>
      </div>

      <div className="dashboard-grid">
        {/* Left Col - Model Health */}
        <div>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="stat-card">
              <div className="stat-card-icon purple">
                <Brain size={20} />
              </div>
              <div className="stat-card-value">{modelMetrics.accuracy}%</div>
              <div className="stat-card-label">Global Accuracy</div>
              <div className="stat-card-trend up">Model: {modelMetrics.modelVersion}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon blue">
                <Target size={20} />
              </div>
              <div className="stat-card-value">{modelMetrics.auc}</div>
              <div className="stat-card-label">ROC AUC Score</div>
              <div className="stat-card-trend up">Excellent Discrimination</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon emerald">
                <Activity size={20} />
              </div>
              <div className="stat-card-value">{modelMetrics.adaptations}</div>
              <div className="stat-card-label">Dynamic Adaptations</div>
              <div className="stat-card-trend up">Continuous Learning Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon yellow">
                <Zap size={20} />
              </div>
              <div className="stat-card-value">{modelMetrics.falsePositiveRate}%</div>
              <div className="stat-card-label">False Positive Rate</div>
              <div className="stat-card-trend down">Below 3.0% Threshold</div>
            </div>
          </div>

          <div className="card animate-in stagger-2" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <div className="card-title">
                <Activity size={16} className="card-title-icon" />
                Adaptive Training Loss History (Last 35 Epochs)
              </div>
            </div>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="epoch" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                    itemStyle={{ color: 'var(--text-primary)', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="loss" stroke="var(--accent-primary)" strokeWidth={2} dot={false} name="Train Loss" />
                  <Line type="monotone" dataKey="valLoss" stroke="var(--accent-secondary)" strokeWidth={2} dot={false} name="Val Loss" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col - Details */}
        <div>
          <div className="card animate-in stagger-3" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div className="card-title">
                <Target size={16} className="card-title-icon" />
                Confusion Matrix (Last 24h)
              </div>
            </div>
            <div className="confusion-matrix">
              <div></div>
              <div className="cm-header">Predicted Positive</div>
              <div className="cm-header">Predicted Negative</div>
              
              <div className="cm-label">Actual Positive</div>
              <div className="cm-cell tp">
                {confusionMatrix.truePositive}
                <div className="cm-cell-label">True Positive</div>
              </div>
              <div className="cm-cell fn">
                {confusionMatrix.falseNegative}
                <div className="cm-cell-label">False Negative</div>
              </div>
              
              <div className="cm-label">Actual Negative</div>
              <div className="cm-cell fp">
                {confusionMatrix.falsePositive}
                <div className="cm-cell-label">False Positive</div>
              </div>
              <div className="cm-cell tn">
                {confusionMatrix.trueNegative}
                <div className="cm-cell-label">True Negative</div>
              </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Precision: {modelMetrics.precision}% | Recall: {modelMetrics.recall}% | F1 Score: {modelMetrics.f1Score}%
            </div>
          </div>

          <div className="card animate-in stagger-4">
            <div className="card-header">
              <div className="card-title">
                <Brain size={16} className="card-title-icon" />
                Real-time Feature Importance
              </div>
            </div>
            <div>
              {featureImportance.slice(0, 6).map((feat, idx) => (
                <div key={idx} className="feature-bar-row">
                  <div className="feature-bar-label">{feat.feature}</div>
                  <div className="feature-bar-track">
                    <div className="feature-bar-fill" style={{ width: `${feat.importance * 100}%` }}></div>
                  </div>
                  <div className="feature-bar-value">{(feat.importance).toFixed(2)}</div>
                  <div className={`feature-bar-delta ${parseFloat(feat.delta) > 0 ? 'positive' : parseFloat(feat.delta) < 0 ? 'negative' : 'neutral'}`}>
                    {feat.delta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
