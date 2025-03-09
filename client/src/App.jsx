import CommentForm from "./CommentForm"
import CommentModal from "./CommentsPage"
import Header from "./header"
import { Link } from "react-router-dom"

function App() {

  return (
    <div>
      <Header />
      <section className="subheader">
        <img src="https://styles.redditmedia.com/t5_2qs0q/styles/bannerBackgroundImage_7glcgg5ymxp21.png?width=2176&frame=1&auto=webp&s=66323ac09252b2feae8ba39c317ae2647733c260" alt="" />
      </section>
      {/* <CommentForm /> */}
      {/* <CommentModal open={true}/> */}
      <Link to="/Comments">Go to Comments</Link>
    </div>
  )
}

export default App


