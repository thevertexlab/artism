import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IsmismIntro: React.FC = () => {
  const navigate = useNavigate();

  const navigateToTimeline = () => {
    navigate('/timeline');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black/20 to-black/40 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题部分 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            主义主义机
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            对艺术主义的解构与重构
          </p>
        </motion.div>

        {/* 详细介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg prose-invert mx-auto mb-16 text-gray-300 leading-relaxed"
        >
          <p>
            主义主义机（IsmismMachine）是⼀台思想的发动机，也是⼀场对艺术史上"主义"传统
            的深度解剖与重组。该项⽬以极具批判性的视⾓，剖析了现代与当代艺术中层出不穷
            的"主义"现象——⽆论是印象主义、表现主义，还是后现代主义、观念主义，这些标签在
            艺术史的⻓河中不断更迭，却往往流于表⾯、形式与⻛格的更替，⽽⾮观念与本质的真正
            ⾰新。
          </p>
          <p>
            主义主义机通过对既有"主义"的拆解、重组与再造，⽣成了⼤量全新且荒诞的"主义"——
            这些新"主义"既是对历史的戏仿，也是对当下艺术⽣态的讽喻。项⽬采⽤了如字⺟重组
            （anagramme）、语义错位、观念拼贴等多种艺术⼿法，将原本严肃的艺术理论转化为
            充满游戏性与批判性的⽂本与视觉作品。观众在⾯对这些新"主义"时，既会感受到荒谬与
            幽默，也会被迫思考：艺术的进步究竟是观念的突破，还是标签的堆砌？艺术家是否只是
            不断在"主义"的外壳中游⾛，⽽忽略了内核的创新？
          </p>
          <p>
            主义主义机以其独特的讽刺性和实验性，揭⽰了当代艺术在"主义"狂欢中的困境与迷思，
            呼吁艺术家和观众重新审视艺术的本质与未来的可能性。它不仅是对艺术史的反思，更是
            对艺术未来的⼀次激进提问。
          </p>
        </motion.div>

        {/* 探索按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <button 
            onClick={navigateToTimeline}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <span>探索艺术时间线</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default IsmismIntro; 