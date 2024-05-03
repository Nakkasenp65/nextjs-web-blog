import React from "react";

const Learn = () => {
  return (
    <div className="flex justify-center flex-col items-center h-fit p-12 sm:p-16 md:p-24 mt-16 gap-16">
      <h1 className="text-2xl sm:text-3xl">How to Write a Blog?</h1>
      <p className="flex-1 text-sm md:text-xl">
        <span className="special-word font-bold text-base sm:text-2xl md:text-3xl ">
          💡Choose Your Topic:
        </span>{" "}
        Start by selecting a topic that resonates with you and your audience.
        Whether it's a personal experience, a trending issue, or a niche
        interest, ensure your topic is relevant and engaging.
        <br />
        <br />
        <span className="special-word font-bold sm:text-2xl md:text-3xl">
          📕Plan Your Content:
        </span>{" "}
        Outline your blog post by organizing your ideas into a coherent
        structure. Consider including an introduction to hook your readers, main
        points to develop your topic, and a conclusion to wrap up your thoughts.
        This plan will serve as a roadmap for your writing process.
        <br />
        <br />
        <span className="special-word font-bold sm:text-2xl md:text-3xl ">
          📝Write and Edit:
        </span>{" "}
        Begin drafting your blog post, focusing on clear and concise language
        that captivates your audience. Pay attention to grammar, spelling, and
        formatting as you edit your work for clarity and coherence. Once
        satisfied, publish your blog and share it with the world!
      </p>
    </div>
  );
};

export default Learn;
