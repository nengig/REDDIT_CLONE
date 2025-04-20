function BoardHeader() {
  return (
    <>
      {/* Banner Section */}
      <div
        className="h-20 bg-cover"
        style={{
          backgroundImage:
            'url("https://styles.redditmedia.com/t5_2qs0q/styles/bannerBackgroundImage_7glcgg5ymxp21.png?width=4000&s=9684bc66e812b8730ad694c3f454da8c00a493d7")',
        }}
      ></div>

      {/* Main Section (Profile Image and Title) */}
      <div className="bg-reddit_dark-brighter">
        <div className="mx-6 relative flex items-center">
          {/* Profile Image */}
          <div className="h-20 w-20 rounded-full overflow-hidden relative -top-12 bg-white">
            <img
              src="https://styles.redditmedia.com/t5_2qs0q/styles/communityIcon_kxcmzy9bt1381.jpg?width=256&format=pjpg&s=0a2e472f6fae0712fee4a3b5d44920fe35dbcdaa"
              alt="Community Icon"
            />
          </div>

          {/* Title Section */}
          <div className="pt-4 pl-4">
            <h1 className="text-reddit_text text-3xl font-semibold">
              webdev: reddit for web developers
            </h1>
            <h5 className="text-reddit_text-darker text-lg">r/webdev</h5>
          </div>
        </div>
      </div>
    </>
  );
}

export default BoardHeader;
