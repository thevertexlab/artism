import random
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.models.comment import Comment, AICommentThread
from app.services.artist_service import ArtistService
from app.services.ai_service import AIService
from app.services.comment_service import CommentService
from app.schemas.comment import CommentCreate
import logging

logger = logging.getLogger(__name__)

class AICommentService:
    """
    AI评论生成服务
    
    负责生成AI艺术家之间的自动评论和互动
    """
    
    # 评论模板按艺术家风格分类 - 更加丰富和个性化
    COMMENT_TEMPLATES = {
        'classical': [
            "这幅作品体现了古典美学的永恒价值，{specific_comment}。严谨的构图和完美的比例令人敬佩。",
            "从技法上看，{specific_comment}，这正是我们古典派所追求的完美。每一笔都透露着对传统的敬意。",
            "构图的平衡感令人赞叹，{specific_comment}。这种对和谐的追求正是古典艺术的精髓。",
            "在这件作品中，我看到了古典大师的影子，{specific_comment}。这种对完美的执着令人动容。",
            "作为古典主义的拥护者，我深深被{specific_comment}所打动。这正是艺术应有的庄重与优雅。"
        ],
        'impressionist': [
            "光影的处理让我想起了在吉维尼的那些日子，{specific_comment}。自然光线的变化如此迷人。",
            "色彩的运用如此生动，{specific_comment}，这正是印象派的精髓。每一抹颜色都在诉说着瞬间的美妙。",
            "这种捕捉瞬间的能力，{specific_comment}，让我深受启发。艺术就应该记录生活中的美好时刻。",
            "看到这样的作品，我仿佛感受到了阳光洒在画布上的温暖，{specific_comment}。",
            "从印象主义的角度来看，{specific_comment}，这种对自然光线的敏感度令人赞叹。"
        ],
        'modern': [
            "这种打破传统的勇气值得称赞，{specific_comment}。艺术就应该不断地挑战和革新。",
            "形式与内容的结合很有创新性，{specific_comment}。现代艺术的力量就在于此。",
            "现代艺术就应该这样挑战观众的认知，{specific_comment}。这种前卫的思维让人振奋。",
            "在这件作品中，我看到了艺术的未来方向，{specific_comment}。创新精神值得学习。",
            "作为现代艺术的实践者，我被{specific_comment}深深震撼。这就是时代的声音。"
        ],
        'surrealist': [
            "这让我想起了梦境中的场景，{specific_comment}。想象力的无限延伸令人震撼。",
            "潜意识的表达如此直接，{specific_comment}，这正是超现实主义的力量。心理层面的探索具有深刻意义。",
            "现实与幻想的边界在这里消失了，{specific_comment}。这正是我们超现实主义者所追求的境界。",
            "在这件作品中，梦境与现实交融，{specific_comment}。这种对潜意识的探索开启了艺术的新维度。",
            "作为超现实主义的信徒，我被{specific_comment}深深吸引。这种心灵的自由表达令人着迷。"
        ],
        'abstract': [
            "抽象艺术的纯粹性在这里得到了完美体现，{specific_comment}。色彩与形式的对话超越了具象的束缚。",
            "看到这样的抽象表现，我感受到了艺术的本质力量，{specific_comment}。这种精神层面的表达令人深思。",
            "在这个抽象世界里，{specific_comment}。每一个形状和色块都承载着深刻的情感内涵。",
            "抽象艺术的魅力就在于此，{specific_comment}。它让我们超越表象，直达艺术的核心。"
        ],
        'expressionist': [
            "表现主义的情感张力在这里展现得淋漓尽致，{specific_comment}。这种内心世界的外化令人动容。",
            "从这种表现手法中，我感受到了强烈的情感冲击，{specific_comment}。艺术就应该如此直击人心。",
            "这种情感的直接表达让我深受触动，{specific_comment}。表现主义的力量就在于此。",
            "作为表现主义的践行者，我被{specific_comment}深深感动。这就是艺术的真正力量。"
        ]
    }
    
    # 具体评论内容 - 按技法、情感、创新等维度分类
    SPECIFIC_COMMENTS = {
        'technique': [
            "线条的流畅性展现了艺术家深厚的功底",
            "笔触的控制力令人赞叹",
            "构图的层次感处理得恰到好处",
            "色彩的过渡自然而和谐",
            "明暗对比的运用极其精妙",
            "透视关系把握得十分准确",
            "质感的表现力让人叹为观止",
            "细节的刻画入木三分"
        ],
        'emotion': [
            "情感的传达非常到位",
            "内心世界的表达如此真挚",
            "观者能够深切感受到作品的情感温度",
            "这种情感的共鸣让人动容",
            "艺术家的内心独白跃然纸上",
            "情感的层次丰富而深刻",
            "这种真情实感令人震撼",
            "心灵的触动超越了语言的表达"
        ],
        'innovation': [
            "这种创新值得我们学习",
            "突破传统的勇气令人敬佩",
            "独特的视角开拓了新的可能",
            "创新精神在这里得到了完美体现",
            "这种前卫的表现手法引人深思",
            "艺术语言的革新让人眼前一亮",
            "这种实验性的探索具有开创意义",
            "创造力的迸发令人振奋"
        ],
        'aesthetic': [
            "色彩搭配体现了独特的美学观念",
            "美学品味的高雅令人钦佩",
            "这种审美追求体现了艺术家的修养",
            "美的表达如此纯粹而动人",
            "审美境界的提升让人受益匪浅",
            "这种美学理念值得深入思考",
            "艺术美感的传达恰到好处",
            "美学价值的体现令人赞叹"
        ],
        'philosophy': [
            "展现了艺术家对生活的深刻理解",
            "哲学思考的深度令人敬佩",
            "这种人生感悟值得我们深思",
            "对存在意义的探索引人深思",
            "生命哲学的表达如此深刻",
            "这种思辨精神令人钦佩",
            "对人性的洞察入木三分",
            "哲学思维的体现让人受益匪浅"
        ],
        'general': [
            "这种表现手法很有个人特色",
            "技术与艺术的完美结合",
            "给观者留下了深刻的印象",
            "艺术价值的体现令人赞叹",
            "这种艺术表达具有独特魅力",
            "作品的感染力极其强烈",
            "艺术境界的高度令人仰望",
            "这种艺术成就值得称颂"
        ]
    }
    
    @classmethod
    async def generate_auto_comments(cls, max_comments: int = 5, save_to_db: bool = True) -> List[Dict[str, Any]]:
        """
        自动生成AI艺术家评论

        Args:
            max_comments: 最大生成评论数量
            save_to_db: 是否保存到数据库

        Returns:
            List[Dict[str, Any]]: 生成的评论列表
        """
        try:
            # 尝试从数据库获取真实艺术家数据
            artists = []
            try:
                from app.utils.query_params import QueryParams
                real_artists_response = ArtistService.get_all(QueryParams(page_size=50))
                if real_artists_response.success and len(real_artists_response.data) >= 2:
                    artists = [artist.dict() for artist in real_artists_response.data]
                    logger.info(f"Using {len(artists)} real artists from database")
            except Exception as e:
                logger.warning(f"Failed to get real artists: {e}")

            # 如果没有真实数据，使用模拟数据
            if len(artists) < 2:
                artists = cls._get_mock_artists()
                logger.info("Using mock artists data")

            if len(artists) < 2:
                return []

            generated_comments = []

            for _ in range(max_comments):
                # 随机选择评论者和被评论对象
                commenter = random.choice(artists)
                target = random.choice([a for a in artists if a.get('id') != commenter.get('id')])

                # 生成评论内容
                comment_content = cls._generate_comment_content(commenter, target)

                # 创建评论数据
                comment_data = {
                    'content': comment_content,
                    'author_id': str(commenter.get('id')),
                    'target_type': 'artist',
                    'target_id': str(target.get('id')),
                    'sentiment': cls._determine_sentiment(comment_content),
                    'ai_generated': True,
                    'generation_context': {
                        'commenter_style': cls._get_artist_style(commenter),
                        'target_name': target.get('name'),
                        'generation_time': datetime.utcnow().isoformat()
                    }
                }

                # 如果需要保存到数据库
                if save_to_db:
                    try:
                        comment_create = CommentCreate(**comment_data)
                        saved_comment = CommentService.create_comment(comment_create)
                        generated_comments.append(saved_comment)
                        logger.info(f"Saved comment to database: {saved_comment.get('id')}")
                    except Exception as e:
                        logger.error(f"Failed to save comment to database: {e}")
                        # 如果保存失败，仍然返回生成的数据
                        generated_comments.append(comment_data)
                else:
                    generated_comments.append(comment_data)

                # 添加随机延迟，模拟真实互动
                await asyncio.sleep(random.uniform(0.1, 0.5))

            return generated_comments

        except Exception as e:
            print(f"Error generating auto comments: {e}")
            return []

    @classmethod
    async def generate_reply_comments(cls, parent_comment_id: str, max_replies: int = 3) -> List[Dict[str, Any]]:
        """
        为指定评论生成回复

        Args:
            parent_comment_id: 父评论ID
            max_replies: 最大回复数量

        Returns:
            List[Dict[str, Any]]: 生成的回复列表
        """
        try:
            # 获取父评论信息
            parent_comment = CommentService.get_comment_by_id(parent_comment_id)
            if not parent_comment:
                logger.error(f"Parent comment {parent_comment_id} not found")
                return []

            logger.info(f"Found parent comment: {parent_comment.get('content', '')[:50]}...")

            # 获取艺术家数据
            artists = []
            try:
                from app.utils.query_params import QueryParams
                real_artists_response = ArtistService.get_all(QueryParams(page_size=50))
                if real_artists_response.success and len(real_artists_response.data) >= 2:
                    artists = [artist.dict() for artist in real_artists_response.data]
                    logger.info(f"Using {len(artists)} real artists")
            except Exception as e:
                logger.warning(f"Failed to get real artists: {e}")
                artists = cls._get_mock_artists()
                logger.info(f"Using {len(artists)} mock artists")

            if len(artists) < 2:
                logger.error("Not enough artists to generate replies")
                return []

            generated_replies = []

            for i in range(max_replies):
                # 随机选择回复者（不能是原评论作者）
                available_artists = [a for a in artists if str(a.get('id')) != str(parent_comment['author_id'])]
                if not available_artists:
                    logger.warning("No available artists for reply")
                    break

                replier = random.choice(available_artists)
                logger.info(f"Selected replier: {replier.get('name', 'Unknown')}")

                # 生成回复内容
                reply_content = cls._generate_reply_content(replier, parent_comment)
                logger.info(f"Generated reply content: {reply_content[:50]}...")

                # 创建回复数据
                reply_data = {
                    'content': reply_content,
                    'author_id': str(replier.get('id')),
                    'target_type': parent_comment['target_type'],
                    'target_id': parent_comment['target_id'],
                    'parent_comment_id': parent_comment_id,
                    'sentiment': cls._determine_sentiment(reply_content),
                    'ai_generated': True,
                    'generation_context': {
                        'replier_style': cls._get_artist_style(replier),
                        'parent_author': parent_comment.get('author_name', 'Unknown'),
                        'generation_time': datetime.utcnow().isoformat(),
                        'reply_type': 'response'
                    }
                }

                # 保存到数据库
                try:
                    comment_create = CommentCreate(**reply_data)
                    saved_reply = CommentService.create_comment(comment_create)
                    generated_replies.append(saved_reply)
                    logger.info(f"Successfully generated reply {i+1} to comment {parent_comment_id}")
                except Exception as e:
                    logger.error(f"Failed to save reply: {e}")
                    # 即使保存失败，也返回生成的数据
                    generated_replies.append(reply_data)

                # 添加延迟
                await asyncio.sleep(random.uniform(0.2, 0.8))

            return generated_replies

        except Exception as e:
            logger.error(f"Error generating reply comments: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return []

    @classmethod
    def _generate_reply_content(cls, replier: Dict[str, Any], parent_comment: Dict[str, Any]) -> str:
        """
        生成回复内容

        Args:
            replier: 回复者信息
            parent_comment: 父评论信息

        Returns:
            str: 回复内容
        """
        replier_style = cls._get_artist_style(replier)
        parent_content = parent_comment.get('content', '')

        # 回复模板
        reply_templates = {
            'agreement': [
                "我完全同意您的观点，{specific_response}",
                "说得太对了！{specific_response}",
                "这个见解很深刻，{specific_response}",
                "您说到了关键点，{specific_response}"
            ],
            'elaboration': [
                "在您的基础上，我想补充一点：{specific_response}",
                "这让我想到了另一个角度，{specific_response}",
                "从我的经验来看，{specific_response}",
                "这个话题很有意思，{specific_response}"
            ],
            'question': [
                "这很有启发性，不过我想问：{specific_response}",
                "您提到的这点让我思考，{specific_response}",
                "能否详细说说{specific_response}？",
                "这个观点很新颖，{specific_response}"
            ],
            'contrast': [
                "从另一个角度来看，{specific_response}",
                "我有不同的看法，{specific_response}",
                "这让我想到了对比，{specific_response}",
                "或许我们可以这样理解：{specific_response}"
            ]
        }

        # 根据情感倾向选择回复类型
        parent_sentiment = parent_comment.get('sentiment', 'neutral')
        if parent_sentiment == 'positive':
            reply_type = random.choice(['agreement', 'elaboration'])
        elif parent_sentiment == 'negative':
            reply_type = random.choice(['question', 'contrast'])
        else:
            reply_type = random.choice(list(reply_templates.keys()))

        template = random.choice(reply_templates[reply_type])

        # 生成具体回复内容
        response_content = cls._get_reply_specific_content(replier_style, parent_content)

        return template.format(specific_response=response_content)

    @classmethod
    def _get_reply_specific_content(cls, replier_style: str, parent_content: str) -> str:
        """
        根据回复者风格和父评论内容生成具体回复

        Args:
            replier_style: 回复者风格
            parent_content: 父评论内容

        Returns:
            str: 具体回复内容
        """
        style_responses = {
            'classical': [
                "古典美学的原则在这里得到了很好的体现",
                "这种对传统的坚持让人敬佩",
                "完美的比例和和谐是永恒的追求",
                "这正体现了古典艺术的精神内核"
            ],
            'impressionist': [
                "光影的变化确实是最迷人的",
                "这种对瞬间美的捕捉很有感染力",
                "色彩的情感表达力不容忽视",
                "自然光线的魅力在这里展现无遗"
            ],
            'modern': [
                "创新精神是艺术发展的动力",
                "打破传统才能开创新的可能",
                "这种实验性的探索很有价值",
                "艺术就应该反映时代的声音"
            ],
            'surrealist': [
                "潜意识的表达总是最真实的",
                "梦境与现实的界限确实很模糊",
                "想象力的自由释放令人着迷",
                "这种心理层面的探索很有深度"
            ],
            'abstract': [
                "纯粹的形式语言更能触及本质",
                "抽象的表达超越了具象的局限",
                "色彩与形状的对话很有力量",
                "这种精神层面的交流很珍贵"
            ],
            'expressionist': [
                "情感的直接表达最能打动人心",
                "内心世界的外化很有感染力",
                "这种真挚的情感流露很难得",
                "艺术就应该如此真实地表达内心"
            ]
        }

        responses = style_responses.get(replier_style, style_responses['modern'])
        return random.choice(responses)

    @classmethod
    async def generate_post_comments(cls, post_id: str, max_comments: int = 5) -> List[Dict[str, Any]]:
        """
        为指定帖子生成AI评论

        Args:
            post_id: 帖子ID
            max_comments: 最大评论数量

        Returns:
            List[Dict[str, Any]]: 生成的评论列表
        """
        try:
            # 获取帖子信息
            from app.services.post_service import PostService
            post = PostService.get_post_by_id(post_id)
            if not post:
                logger.error(f"Post {post_id} not found")
                return []

            logger.info(f"Generating comments for post: {post.get('title', '')[:50]}...")

            # 获取艺术家数据
            artists = []
            try:
                from app.utils.query_params import QueryParams
                real_artists_response = ArtistService.get_all(QueryParams(page_size=50))
                if real_artists_response.success and len(real_artists_response.data) >= 2:
                    artists = [artist.dict() for artist in real_artists_response.data]
                    logger.info(f"Using {len(artists)} real artists")
            except Exception as e:
                logger.warning(f"Failed to get real artists: {e}")
                artists = cls._get_mock_artists()
                logger.info(f"Using {len(artists)} mock artists")

            if len(artists) < 2:
                logger.error("Not enough artists to generate comments")
                return []

            generated_comments = []

            for i in range(max_comments):
                # 随机选择评论者（不能是帖子作者）
                available_artists = [a for a in artists if str(a.get('id')) != str(post['author_id'])]
                if not available_artists:
                    logger.warning("No available artists for comment")
                    break

                commenter = random.choice(available_artists)
                logger.info(f"Selected commenter: {commenter.get('name', 'Unknown')}")

                # 生成评论内容
                comment_content = cls._generate_post_comment_content(commenter, post)
                logger.info(f"Generated comment content: {comment_content[:50]}...")

                # 创建评论数据
                comment_data = {
                    'content': comment_content,
                    'author_id': str(commenter.get('id')),
                    'target_type': 'post',
                    'target_id': post_id,
                    'sentiment': cls._determine_sentiment(comment_content),
                    'ai_generated': True,
                    'generation_context': {
                        'commenter_style': cls._get_artist_style(commenter),
                        'post_title': post.get('title', ''),
                        'post_author': post.get('author_name', 'Unknown'),
                        'generation_time': datetime.utcnow().isoformat(),
                        'comment_type': 'post_comment'
                    }
                }

                # 保存到数据库
                try:
                    comment_create = CommentCreate(**comment_data)
                    saved_comment = CommentService.create_comment(comment_create)
                    generated_comments.append(saved_comment)

                    # 增加帖子评论数
                    PostService.increment_comments(post_id)

                    logger.info(f"Successfully generated comment {i+1} for post {post_id}")
                except Exception as e:
                    logger.error(f"Failed to save comment: {e}")
                    # 即使保存失败，也返回生成的数据
                    generated_comments.append(comment_data)

                # 添加延迟
                await asyncio.sleep(random.uniform(0.3, 1.0))

            return generated_comments

        except Exception as e:
            logger.error(f"Error generating post comments: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return []

    @classmethod
    def _generate_post_comment_content(cls, commenter: Dict[str, Any], post: Dict[str, Any]) -> str:
        """
        为帖子生成评论内容

        Args:
            commenter: 评论者信息
            post: 帖子信息

        Returns:
            str: 评论内容
        """
        commenter_style = cls._get_artist_style(commenter)
        post_title = post.get('title', '')
        post_content = post.get('content', '')

        # 帖子评论模板
        post_comment_templates = {
            'classical': [
                "这个作品体现了古典美学的精髓，{specific_comment}。",
                "从古典主义的角度来看，{specific_comment}，这正是艺术应有的庄重。",
                "这种对传统的坚持令人敬佩，{specific_comment}。",
                "完美的构图和比例，{specific_comment}，这就是古典艺术的魅力。"
            ],
            'impressionist': [
                "光影的处理让我想起了在户外写生的日子，{specific_comment}。",
                "这种对瞬间美的捕捉很有感染力，{specific_comment}。",
                "色彩的运用如此生动，{specific_comment}，这正是印象派的精神。",
                "自然光线的变化在这里得到了完美体现，{specific_comment}。"
            ],
            'modern': [
                "这种创新精神正是现代艺术所需要的，{specific_comment}。",
                "打破传统的勇气值得称赞，{specific_comment}。",
                "现代艺术就应该这样挑战观众的认知，{specific_comment}。",
                "这种实验性的探索很有价值，{specific_comment}。"
            ],
            'surrealist': [
                "这让我想起了梦境中的场景，{specific_comment}。",
                "潜意识的表达如此直接，{specific_comment}，这正是超现实主义的力量。",
                "现实与幻想的边界在这里消失了，{specific_comment}。",
                "想象力的自由释放令人着迷，{specific_comment}。"
            ],
            'abstract': [
                "抽象艺术的纯粹性在这里得到了体现，{specific_comment}。",
                "色彩与形式的对话超越了具象的束缚，{specific_comment}。",
                "这种精神层面的表达令人深思，{specific_comment}。",
                "抽象的力量就在于此，{specific_comment}。"
            ],
            'expressionist': [
                "情感的直接表达让我深受触动，{specific_comment}。",
                "这种内心世界的外化令人动容，{specific_comment}。",
                "表现主义的力量就在于此，{specific_comment}。",
                "艺术就应该如此直击人心，{specific_comment}。"
            ]
        }

        # 根据帖子内容生成具体评论
        specific_comment = cls._get_post_specific_comment(commenter_style, post_title, post_content)

        # 选择模板
        templates = post_comment_templates.get(commenter_style, post_comment_templates['modern'])
        template = random.choice(templates)

        return template.format(specific_comment=specific_comment)

    @classmethod
    def _get_post_specific_comment(cls, commenter_style: str, post_title: str, post_content: str) -> str:
        """
        根据帖子内容生成具体评论

        Args:
            commenter_style: 评论者风格
            post_title: 帖子标题
            post_content: 帖子内容

        Returns:
            str: 具体评论内容
        """
        # 根据帖子内容关键词生成相关评论
        content_lower = (post_title + " " + post_content).lower()

        if any(keyword in content_lower for keyword in ['color', '颜色', '色彩', 'paint', '绘画']):
            return random.choice([
                "色彩的运用很有个人特色",
                "这种色彩搭配很有创意",
                "颜色的情感表达力很强",
                "色彩的层次感处理得很好"
            ])
        elif any(keyword in content_lower for keyword in ['light', '光', 'shadow', '影', '明暗']):
            return random.choice([
                "光影的处理很有技巧",
                "明暗对比的运用很精妙",
                "光线的表现很自然",
                "这种光影效果很有感染力"
            ])
        elif any(keyword in content_lower for keyword in ['emotion', '情感', 'feel', '感受', '心情']):
            return random.choice([
                "情感的传达很到位",
                "这种情感表达很真挚",
                "能感受到强烈的情感共鸣",
                "内心世界的表达很深刻"
            ])
        elif any(keyword in content_lower for keyword in ['technique', '技法', 'skill', '技巧', '手法']):
            return random.choice([
                "技法的运用很娴熟",
                "这种表现手法很独特",
                "技术与艺术的结合很完美",
                "技巧的掌握很扎实"
            ])
        else:
            # 通用评论
            return random.choice([
                "这个作品很有启发性",
                "艺术表达很有个人特色",
                "创作理念很值得思考",
                "这种艺术探索很有意义",
                "作品的感染力很强",
                "艺术价值很高"
            ])
    
    @classmethod
    def _generate_comment_content(cls, commenter: Dict[str, Any], target: Dict[str, Any]) -> str:
        """
        根据艺术家风格生成评论内容

        Args:
            commenter: 评论者信息
            target: 被评论者信息

        Returns:
            str: 生成的评论内容
        """
        commenter_style = cls._get_artist_style(commenter)
        target_style = cls._get_artist_style(target)

        # 选择评论模板
        templates = cls.COMMENT_TEMPLATES.get(commenter_style, cls.COMMENT_TEMPLATES['modern'])
        template = random.choice(templates)

        # 根据目标艺术家和评论者的关系选择合适的评论类型
        specific_comment = cls._get_contextual_comment(commenter, target, commenter_style, target_style)

        return template.format(specific_comment=specific_comment)

    @classmethod
    def _get_contextual_comment(cls, commenter: Dict[str, Any], target: Dict[str, Any],
                               commenter_style: str, target_style: str) -> str:
        """
        根据上下文生成具体评论内容

        Args:
            commenter: 评论者信息
            target: 被评论者信息
            commenter_style: 评论者风格
            target_style: 目标艺术家风格

        Returns:
            str: 具体评论内容
        """
        # 根据艺术家名字进行个性化评论
        target_name = target.get('name', '').lower()

        # 特定艺术家的个性化评论
        if '达芬奇' in target_name or 'leonardo' in target_name:
            return random.choice([
                "这种科学与艺术的结合令人敬佩",
                "解剖学知识在艺术中的运用如此精妙",
                "理性与感性的完美平衡让人赞叹"
            ])
        elif '毕加索' in target_name or 'picasso' in target_name:
            return random.choice([
                "立体主义的革新精神值得学习",
                "几何形体的重构展现了独特的视角",
                "这种对传统透视的颠覆令人震撼"
            ])
        elif '梵高' in target_name or 'van gogh' in target_name:
            return random.choice([
                "这种情感的强烈表达让人动容",
                "色彩的情感化运用如此打动人心",
                "笔触中蕴含的生命力令人震撼"
            ])
        elif '莫奈' in target_name or 'monet' in target_name:
            return random.choice([
                "光影变化的捕捉如此细腻",
                "这种对自然光线的敏感度令人赞叹",
                "色彩的微妙变化展现了印象派的精髓"
            ])
        elif '达利' in target_name or 'dali' in target_name:
            return random.choice([
                "梦境与现实的交融如此奇妙",
                "潜意识的视觉化表达令人着迷",
                "这种超现实的想象力让人叹为观止"
            ])

        # 根据风格匹配选择评论类型
        if commenter_style == target_style:
            # 同风格艺术家更容易产生技法和美学共鸣
            comment_types = ['technique', 'aesthetic', 'general']
        elif commenter_style == 'classical' and target_style in ['modern', 'abstract']:
            # 古典派对现代派可能更关注创新
            comment_types = ['innovation', 'philosophy']
        elif commenter_style in ['modern', 'abstract'] and target_style == 'classical':
            # 现代派对古典派可能更关注技法
            comment_types = ['technique', 'aesthetic']
        else:
            # 其他情况随机选择
            comment_types = list(cls.SPECIFIC_COMMENTS.keys())

        # 随机选择评论类型和具体内容
        comment_type = random.choice(comment_types)
        return random.choice(cls.SPECIFIC_COMMENTS[comment_type])
    
    @classmethod
    def _get_artist_style(cls, artist: Dict[str, Any]) -> str:
        """
        根据艺术家信息判断其风格类别

        Args:
            artist: 艺术家信息

        Returns:
            str: 风格类别
        """
        name = artist.get('name', '').lower()
        bio = artist.get('bio', '').lower()

        # 古典主义
        classical_keywords = [
            'leonardo', 'michelangelo', 'raphael', 'botticelli', 'caravaggio',
            '达芬奇', '米开朗基罗', '拉斐尔', '波提切利', '卡拉瓦乔',
            'classical', 'renaissance', '古典', '文艺复兴'
        ]

        # 印象派
        impressionist_keywords = [
            'monet', 'renoir', 'degas', 'pissarro', 'sisley', 'manet',
            '莫奈', '雷诺阿', '德加', '毕沙罗', '西斯莱', '马奈',
            'impressionist', 'impressionism', '印象派', '印象主义'
        ]

        # 超现实主义
        surrealist_keywords = [
            'dali', 'magritte', 'ernst', 'miro', 'tanguy',
            '达利', '马格里特', '恩斯特', '米罗', '唐吉',
            'surrealist', 'surrealism', '超现实', '超现实主义'
        ]

        # 表现主义
        expressionist_keywords = [
            'munch', 'kandinsky', 'klee', 'kirchner', 'nolde',
            '蒙克', '康定斯基', '克利', '基希纳', '诺尔德',
            'expressionist', 'expressionism', '表现主义', '表现派'
        ]

        # 抽象主义
        abstract_keywords = [
            'mondrian', 'pollock', 'rothko', 'newman', 'kline',
            '蒙德里安', '波洛克', '罗斯科', '纽曼', '克莱因',
            'abstract', 'abstraction', '抽象', '抽象主义'
        ]

        # 现代主义（包括立体主义等）
        modern_keywords = [
            'picasso', 'braque', 'matisse', 'cezanne', 'gauguin',
            '毕加索', '布拉克', '马蒂斯', '塞尚', '高更',
            'modern', 'cubism', 'fauvism', '现代', '立体主义', '野兽派'
        ]

        # 按优先级检查风格
        if any(keyword in name or keyword in bio for keyword in classical_keywords):
            return 'classical'
        elif any(keyword in name or keyword in bio for keyword in impressionist_keywords):
            return 'impressionist'
        elif any(keyword in name or keyword in bio for keyword in surrealist_keywords):
            return 'surrealist'
        elif any(keyword in name or keyword in bio for keyword in expressionist_keywords):
            return 'expressionist'
        elif any(keyword in name or keyword in bio for keyword in abstract_keywords):
            return 'abstract'
        elif any(keyword in name or keyword in bio for keyword in modern_keywords):
            return 'modern'
        else:
            # 默认返回现代风格
            return 'modern'
    
    @classmethod
    def _determine_sentiment(cls, content: str) -> str:
        """
        分析评论情感倾向
        
        Args:
            content: 评论内容
            
        Returns:
            str: 情感倾向 ('positive', 'negative', 'neutral')
        """
        positive_words = ['赞叹', '完美', '精髓', '启发', '称赞', '创新', '深刻', '敬佩', '学习', '动容']
        negative_words = ['失望', '缺乏', '不足', '问题', '错误']
        
        positive_count = sum(1 for word in positive_words if word in content)
        negative_count = sum(1 for word in negative_words if word in content)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    @classmethod
    async def create_comment_thread(cls, topic: str, participant_ids: List[int]) -> Optional[Dict[str, Any]]:
        """
        创建AI评论对话线程
        
        Args:
            topic: 对话主题
            participant_ids: 参与者ID列表
            
        Returns:
            Optional[Dict[str, Any]]: 创建的线程信息
        """
        try:
            thread = AICommentThread(
                topic=topic,
                participants=participant_ids,
                thread_type='discussion',
                max_comments=random.randint(5, 15)
            )
            
            return thread.to_dict()
            
        except Exception as e:
            print(f"Error creating comment thread: {e}")
            return None

    @classmethod
    def _get_mock_artists(cls) -> List[Dict[str, Any]]:
        """
        获取模拟艺术家数据

        Returns:
            List[Dict[str, Any]]: 模拟艺术家列表
        """
        return [
            {
                'id': 1,
                'name': 'AI Leonardo da Vinci',
                'bio': '文艺复兴时期的天才艺术家，科学家与艺术的完美结合',
                'birth_year': 1452,
                'death_year': 1519
            },
            {
                'id': 2,
                'name': 'AI Pablo Picasso',
                'bio': '立体主义的创始人，现代艺术的革命者',
                'birth_year': 1881,
                'death_year': 1973
            },
            {
                'id': 3,
                'name': 'AI Vincent van Gogh',
                'bio': '后印象派画家，以强烈的情感表达著称',
                'birth_year': 1853,
                'death_year': 1890
            },
            {
                'id': 4,
                'name': 'AI Claude Monet',
                'bio': '印象派的创始人之一，光影大师',
                'birth_year': 1840,
                'death_year': 1926
            },
            {
                'id': 5,
                'name': 'AI Salvador Dalí',
                'bio': '超现实主义的代表人物，梦境与现实的探索者',
                'birth_year': 1904,
                'death_year': 1989
            },
            {
                'id': 6,
                'name': 'AI Frida Kahlo',
                'bio': '墨西哥女画家，以自画像和痛苦的表达闻名',
                'birth_year': 1907,
                'death_year': 1954
            }
        ]
