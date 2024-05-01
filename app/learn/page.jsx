import React from "react";

const Learn = () => {
  return (
    <div className="flex justify-center flex-col items-center h-96 p-80 gap-16">
      <h1>How to Write a Blog?</h1>
      <p className="flex-1 text-xl">
        <span className="special-word">Choose Your Topic:</span> Start by
        selecting a topic that resonates with you and your audience. Whether
        it's a personal experience, a trending issue, or a niche interest,
        ensure your topic is relevant and engaging.
        <br />
        <br />
        <span className="special-word">Plan Your Content:</span> Outline your
        blog post by organizing your ideas into a coherent structure. Consider
        including an introduction to hook your readers, main points to develop
        your topic, and a conclusion to wrap up your thoughts. This plan will
        serve as a roadmap for your writing process.
        <br />
        <br />
        <span className="special-word">Write and Edit:</span> Begin drafting
        your blog post, focusing on clear and concise language that captivates
        your audience. Pay attention to grammar, spelling, and formatting as you
        edit your work for clarity and coherence. Once satisfied, publish your
        blog and share it with the world!
      </p>
    </div>
  );
};

export default Learn;
