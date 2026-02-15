import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  barcode: string;
}

export default function LoadingSkeleton({ barcode }: LoadingSkeletonProps) {
  return (
    <div className="loading-wrap">
      <div className="loading-header">
        <div className="loading-spinner" />
        <div>
          <p className="loading-title">Analyzing product...</p>
          <p className="loading-barcode">{barcode}</p>
        </div>
      </div>

      <div className="glass-card skel-card">
        <div className="skeleton skel-img" />
        <div className="skeleton skel-line skel-line-lg" />
        <div className="skeleton skel-line skel-line-md" />
      </div>

      <div className="glass-card skel-card">
        <div className="skeleton skel-line skel-line-sm" />
        <div className="skeleton skel-line skel-line-full" />
        <div className="skeleton skel-line skel-line-full" />
        <div className="skeleton skel-line skel-line-lg" />
      </div>

      <div className="glass-card skel-card">
        <div className="skeleton skel-line skel-line-sm" />
        <div className="skel-grid">
          <div className="skeleton skel-box" />
          <div className="skeleton skel-box" />
          <div className="skeleton skel-box" />
          <div className="skeleton skel-box" />
        </div>
      </div>
    </div>
  );
}
