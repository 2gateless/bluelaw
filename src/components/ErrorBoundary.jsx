import React from 'react';
import { RotateCw } from 'lucide-react';

// 동적 청크 로드 실패나 예기치 못한 렌더링 오류를 처리하는 에러 바운더리
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-box" role="alert">
          <p className="error-boundary-title">화면을 불러오는 중 문제가 발생했습니다.</p>
          <p className="error-boundary-desc">
            네트워크 연결을 확인하거나 앱을 다시 불러와 주세요.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="iframe-fallback-btn error-boundary-btn"
          >
            <RotateCw size={14} />
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
