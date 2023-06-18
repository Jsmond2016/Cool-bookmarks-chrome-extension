import React from "react"
import "./style.scss"

const NotFind: React.FC = () => {
  return (
    <div className="not-find-wrap">
      <div className="error">
        <section className="error-container">
          <span>4</span>
          <span>
            <span className="screen-reader-text "></span>
          </span>
          <span>4</span>
        </section>
        <p>哎呀，找不到了</p>
      </div>
    </div>
  )
}
export default NotFind
