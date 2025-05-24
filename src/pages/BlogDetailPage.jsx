import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Typography, Row, Col, Divider, Tag, Card, Avatar, Button, Space, List } from "antd";
import { CalendarOutlined, UserOutlined, TagOutlined, ClockCircleOutlined, RightOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;

// Blog posts data
const blogPostsData = [
  {
    id: 1,
    slug: "modern-mothers-8-surprising-facts",
    title: "Modern Mothers: 8 Surprising Facts",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/pc5.jpg",
    author: "Dr. Sarah Johnson",
    authorImage: "/images/features/pc11.jpg",
    readTime: "8 min read",
    category: "Pregnancy",
    tags: ["Motherhood", "Pregnancy", "Women's Health"],
    summary: "Discover the fascinating changes in modern motherhood and how today's mothers navigate their pregnancy journey differently than previous generations.",
    content: [
      "Modern motherhood has evolved significantly over the past few decades, with women balancing career, personal aspirations, and family in new ways. Here are eight surprising facts about modern mothers that reflect these changes:",
      "1. Average age of first-time mothers has increased to 30+ in many developed countries, compared to early 20s in the 1970s.",
      "2. Over 70% of mothers with children under 18 participate in the labor force, compared to 47% in 1975.",
      "3. One in five births is now to women over 35, with advanced fertility treatments making this increasingly possible.",
      "4. Studies show children of working mothers often develop stronger social skills and academic performance.",
      "5. Modern mothers spend more quality time with their children despite working outside the home more than previous generations.",
      "6. Digital tools have transformed motherhood, with 90% of new mothers using apps to track baby development, feeding schedules, and health information.",
      "7. Community support increasingly comes from online sources, with 65% of new mothers joining virtual support groups.",
      "8. Birth preferences have diversified, with increased interest in natural birthing methods, doula support, and birthing centers alongside traditional hospital births."
    ],
    relatedPosts: [2, 3, 9]
  },
  {
    id: 2,
    slug: "top-7-causes-of-infertility-in-women",
    title: "Top 7 Causes of Infertility in Women",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/pc4.jpg",
    author: "Dr. Michael Brown",
    authorImage: "/images/features/pc12.jpg",
    readTime: "10 min read",
    category: "Fertility",
    tags: ["Infertility", "Women's Health", "Reproductive Health"],
    summary: "Understanding the most common factors that contribute to female infertility and how modern medicine can address these challenges.",
    content: [
      "Infertility affects approximately 10-15% of couples, with female factors contributing to about one-third of these cases. Understanding the common causes can help women seek appropriate treatment. Here are the top seven causes of infertility in women:",
      "1. Ovulation Disorders: Problems with ovulation account for about 25% of female infertility cases. Conditions like PCOS (Polycystic Ovary Syndrome), hypothalamic dysfunction, premature ovarian insufficiency, and hyperprolactinemia can disrupt regular egg release.",
      "2. Fallopian Tube Damage or Blockage: Damaged or blocked fallopian tubes prevent sperm from reaching the egg or block the passage of the fertilized egg to the uterus. This can result from pelvic inflammatory disease, previous surgeries, or endometriosis.",
      "3. Endometriosis: This condition occurs when tissue similar to the lining of the uterus implants and grows outside the uterus, affecting the function of the ovaries, uterus, and fallopian tubes.",
      "4. Uterine or Cervical Abnormalities: Structural problems such as fibroids, polyps, or abnormalities in the uterine shape can interfere with implantation or increase the risk of miscarriage.",
      "5. Primary Ovarian Insufficiency: This occurs when ovaries stop working normally before age 40, reducing estrogen production and egg release.",
      "6. Age-Related Factors: Female fertility gradually declines with age, particularly after 35, due to decreasing egg quantity and quality.",
      "7. Unexplained Infertility: In about 10-30% of infertility cases, standard fertility testing cannot identify the specific cause."
    ],
    relatedPosts: [3, 6, 7]
  },
  {
    id: 3,
    slug: "ivf-or-ivm-which-is-right-for-you",
    title: "Which is Right for You: IVF or IVM?",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/pc6.jpg",
    author: "Dr. Andrew Peterson",
    authorImage: "/images/features/pc10.jpg",
    readTime: "12 min read",
    category: "Fertility Treatments",
    tags: ["IVF", "IVM", "Fertility Treatment", "Reproductive Technology"],
    summary: "A comprehensive comparison of In Vitro Fertilization (IVF) and In Vitro Maturation (IVM) to help you understand which fertility treatment might be best for your situation.",
    content: [
      "When considering fertility treatments, understanding the differences between IVF and IVM is crucial for making an informed decision. Here's a detailed comparison of these two important fertility procedures:",
      "In Vitro Fertilization (IVF) is the most widely known and practiced assisted reproductive technology. It involves stimulating the ovaries with hormones to produce multiple eggs, which are then retrieved and fertilized in a laboratory. The resulting embryos are cultured for 3-5 days before the best quality embryos are transferred to the uterus.",
      "In Vitro Maturation (IVM) is a newer technique where immature eggs are retrieved from the ovaries with minimal or no hormone stimulation. These eggs are then matured in the laboratory before being fertilized. This approach requires fewer medications and monitoring.",
      "Key differences to consider when choosing between IVF and IVM:",
      "1. Hormone Stimulation: IVF typically requires 8-12 days of hormone injections to stimulate egg production, while IVM requires minimal or no stimulation.",
      "2. Cost: IVM is generally less expensive than IVF due to fewer medications and monitoring appointments.",
      "3. Time Commitment: IVF requires more clinic visits for monitoring, while IVM requires fewer appointments.",
      "4. Success Rates: IVF currently has higher success rates (30-40% per cycle) compared to IVM (20-30% per cycle).",
      "5. Ideal Candidates: IVF is suitable for most fertility patients, while IVM may be particularly beneficial for women with PCOS, those at risk of ovarian hyperstimulation syndrome, cancer patients preserving fertility before treatment, or those with hormone-sensitive conditions."
    ],
    relatedPosts: [1, 2, 6]
  },
  {
    id: 4,
    slug: "pregnancy-test-step-by-step",
    title: "How to Take a Pregnancy Test, Step-by-Step",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/pc3.jpg",
    author: "Dr. Emily Roberts",
    authorImage: "/images/features/Pc1.jpg",
    readTime: "5 min read",
    category: "Pregnancy",
    tags: ["Pregnancy Test", "Early Pregnancy", "Women's Health"],
    summary: "A comprehensive guide on how to properly take a home pregnancy test for the most accurate results.",
    content: [
      "Taking a pregnancy test correctly is essential for accurate results. Here's a detailed step-by-step guide to help you through the process:",
      "When to Test:",
      "• Wait until at least the first day of your missed period for the most accurate results",
      "• Some sensitive tests can detect pregnancy up to 5 days before your missed period",
      "• Morning urine contains the highest concentration of hCG (pregnancy hormone)",
      
      "What You'll Need:",
      "• Home pregnancy test kit",
      "• Clean cup (if not using a direct stream test)",
      "• Timer or clock",
      "• Privacy and a well-lit bathroom",
      
      "Step 1: Read the Instructions Carefully",
      "Each brand of pregnancy test may have slightly different instructions. Take time to read and understand the specific directions for your test.",
      
      "Step 2: Collect Your Urine Sample",
      "Either urinate directly on the test stick's absorbent tip or collect urine in a clean cup and dip the test as directed.",
      
      "Step 3: Wait the Specified Time",
      "Place the test on a flat surface and wait exactly as long as the instructions indicate (usually 1-5 minutes). Set a timer to be precise.",
      
      "Step 4: Read the Results",
      "Check the results window within the timeframe specified. Results read too early or too late may be inaccurate.",
      
      "Understanding the Results:",
      "• Positive: Even a faint second line typically indicates pregnancy",
      "• Negative: Only the control line appears",
      "• Invalid: No lines or only a test line (without control line) appears",
      
      "Next Steps:",
      "• Positive result: Schedule an appointment with your healthcare provider",
      "• Negative result but symptoms persist: Wait a few days and test again",
      "• Invalid result: Repeat with a new test",
      
      "Remember that home pregnancy tests are about 99% accurate when used correctly, but factors like medications, testing too early, or using an expired test can affect results."
    ],
    relatedPosts: [1, 5, 9]
  },
  {
    id: 5,
    slug: "fertility-preservation-for-cancer-patients",
    title: "Fertility Preservation for Women Diagnosed with Cancer",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/pc9.jpg",
    author: "Dr. Sarah Johnson",
    authorImage: "/images/features/pc11.jpg",
    readTime: "9 min read",
    category: "Fertility Preservation",
    tags: ["Cancer", "Fertility Preservation", "Egg Freezing", "Oncofertility"],
    summary: "Learn about the options available for women diagnosed with cancer to preserve their fertility before undergoing treatments that may affect reproductive function.",
    content: [
      "A cancer diagnosis is life-changing, and for women of reproductive age, concerns about future fertility add another layer of complexity. Fortunately, advances in reproductive medicine offer several options for fertility preservation before cancer treatment begins.",
      
      "Why Cancer Treatments Affect Fertility:",
      "Many cancer treatments can compromise fertility. Chemotherapy can damage eggs, radiation to the pelvic area can affect reproductive organs, and some surgeries may remove reproductive structures. The risk varies based on the type of treatment, dosage, and the woman's age.",
      
      "Fertility Preservation Options:",
      
      "1. Egg Freezing (Oocyte Cryopreservation)",
      "This is the most established method for women without partners. The process involves hormone stimulation for 10-14 days, egg retrieval, and freezing unfertilized eggs for future use. For women with cancer, protocols can be modified to reduce hormone exposure.",
      
      "2. Embryo Freezing",
      "Similar to egg freezing but includes fertilization with partner's or donor sperm before freezing. This offers slightly higher success rates than egg freezing but requires a sperm source.",
      
      "3. Ovarian Tissue Freezing",
      "This experimental option involves removing and freezing ovarian tissue containing immature eggs. Later, the tissue can be reimplanted. This is the only option for prepubescent girls and women who cannot delay treatment.",
      
      "4. Ovarian Suppression During Treatment",
      "Medications (GnRH agonists) may help protect ovaries during chemotherapy by putting them in a temporary dormant state, though evidence for effectiveness varies.",
      
      "5. Ovarian Transposition",
      "For women receiving pelvic radiation, surgically moving the ovaries away from the radiation field may preserve function.",
      
      "The Decision-Making Process:",
      "• Consult with a reproductive endocrinologist as soon as possible after diagnosis",
      "• Consider your age, relationship status, treatment plan, and cancer type",
      "• Discuss financial aspects and insurance coverage",
      "• Explore emotional support resources for this complex decision",
      
      "Timing is critical, as fertility preservation ideally occurs before cancer treatment begins. However, in many cases, the process can be expedited to avoid significant treatment delays."
    ],
    relatedPosts: [2, 3, 7]
  },
  {
    id: 6,
    slug: "male-infertility-facts",
    title: "Male Infertility: Fact from Fiction",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/pc10.jpg",
    author: "Dr. Michael Brown",
    authorImage: "/images/features/pc12.jpg",
    readTime: "7 min read",
    category: "Fertility",
    tags: ["Male Infertility", "Men's Health", "Reproductive Health"],
    summary: "Separating myths from reality about male infertility causes, diagnosis, and treatment options.",
    content: [
      "Male infertility is often surrounded by misconceptions and stigma. Understanding the facts is crucial for proper diagnosis and treatment. Let's separate fact from fiction on this important topic.",
      
      "FICTION: Infertility is primarily a female issue.",
      "FACT: Male factors contribute to approximately 50% of all infertility cases. In about one-third of cases, male factors are the sole cause of infertility.",
      
      "FICTION: Lifestyle factors have minimal impact on male fertility.",
      "FACT: Several lifestyle factors significantly affect sperm health, including smoking, excessive alcohol consumption, drug use, obesity, exposure to environmental toxins, and prolonged heat to the testicles (from frequent hot tubs, saunas, or tight clothing).",
      
      "FICTION: Age doesn't affect male fertility.",
      "FACT: While men produce sperm throughout their lives, sperm quality and quantity decline with age, particularly after 40. Advanced paternal age is also associated with increased risk of genetic abnormalities and certain health conditions in offspring.",
      
      "FICTION: Low sperm count always means infertility.",
      "FACT: While a normal sperm count improves chances of conception, men with low sperm counts can still father children. Even one healthy sperm can fertilize an egg, especially with assisted reproductive technologies.",
      
      "FICTION: Male infertility can't be treated.",
      "FACT: Many causes of male infertility are treatable or can be bypassed with assisted reproductive techniques:",
      "• Hormonal imbalances can often be corrected with medication",
      "• Varicoceles (enlarged veins in the scrotum) can be surgically repaired",
      "• Obstructions in the reproductive tract can sometimes be removed",
      "• Infections can be treated with antibiotics",
      "• ICSI (Intracytoplasmic Sperm Injection) can achieve fertilization even with very few sperm",
      
      "FICTION: If a man has fathered a child before, he can't have fertility problems now.",
      "FACT: Secondary infertility (difficulty conceiving after previously fathering a child) is common and can result from new health issues, age-related decline in fertility, or changes in lifestyle factors.",
      
      "FICTION: Sperm quality can't be improved.",
      "FACT: Many men can improve sperm parameters through lifestyle modifications including:",
      "• Maintaining a healthy weight",
      "• Eating a balanced diet rich in antioxidants",
      "• Regular moderate exercise",
      "• Reducing stress",
      "• Avoiding tobacco, excessive alcohol, and recreational drugs",
      "• Taking appropriate supplements (under medical guidance)"
    ],
    relatedPosts: [2, 3, 7]
  },
  {
    id: 7,
    slug: "endo-and-fertility-health",
    title: "Endo and Your Fertility Health",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/pc11.jpg",
    author: "Dr. Emily Roberts",
    authorImage: "/images/features/Pc1.jpg",
    readTime: "11 min read",
    category: "Women's Health",
    tags: ["Endometriosis", "Fertility", "Women's Health", "Reproductive Health"],
    summary: "How endometriosis affects fertility and what treatment options are available for women with this condition who want to conceive.",
    content: [
      "Endometriosis affects approximately 10% of women of reproductive age worldwide and is a leading cause of infertility. Understanding the relationship between endometriosis and fertility is crucial for women diagnosed with this condition who hope to have children.",
      
      "How Endometriosis Affects Fertility:",
      
      "Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus. This condition can impact fertility in several ways:",
      
      "1. Anatomical Distortion: Severe endometriosis can cause adhesions and scarring that distort pelvic anatomy, potentially blocking fallopian tubes or interfering with ovarian function.",
      
      "2. Inflammation: The inflammatory environment created by endometriosis may be toxic to eggs, sperm, and embryos.",
      
      "3. Hormonal Imbalances: Endometriosis can disrupt the hormonal environment necessary for conception and implantation.",
      
      "4. Reduced Egg Quality: Some research suggests endometriosis may affect egg quality and ovarian reserve.",
      
      "5. Implantation Difficulties: Even with normal fallopian tubes, women with endometriosis may have reduced rates of embryo implantation.",
      
      "Fertility Treatment Options for Women with Endometriosis:",
      
      "1. Medical Management:",
      "While hormonal treatments (like birth control pills) are often used to manage endometriosis symptoms, they prevent pregnancy and must be discontinued when trying to conceive. However, some physicians recommend a course of hormonal suppression before attempting conception.",
      
      "2. Surgical Treatment:",
      "Laparoscopic surgery to remove endometriosis lesions can improve natural fertility rates, particularly for minimal to mild endometriosis. The benefit for severe disease is less clear but may improve IVF outcomes.",
      
      "3. Assisted Reproductive Technologies:",
      "• Fertility medications with timed intercourse or intrauterine insemination (IUI) may be effective for minimal to mild endometriosis",
      "• In vitro fertilization (IVF) often provides the highest success rates, especially for moderate to severe cases",
      "• IVF with ICSI (intracytoplasmic sperm injection) may be recommended if there are concerns about egg quality",
      
      "Timing Considerations:",
      "For women with known endometriosis who want to have children, timing is an important consideration. Since endometriosis can be progressive and fertility declines with age, it may be advisable not to delay pregnancy attempts for too long after diagnosis.",
      
      "The good news is that many women with endometriosis successfully conceive and have healthy pregnancies, either naturally or with appropriate fertility treatments. Early consultation with a reproductive endocrinologist can help develop the most effective treatment plan."
    ],
    relatedPosts: [2, 5, 9]
  },
  {
    id: 8,
    slug: "zika-virus-risks-for-patients",
    title: "Risk to Patients Exposed to the Zika Virus",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/pc12.jpg",
    author: "Dr. Andrew Peterson",
    authorImage: "/images/features/pc10.jpg",
    readTime: "8 min read",
    category: "Health Alerts",
    tags: ["Zika Virus", "Pregnancy", "Public Health", "Infectious Disease"],
    summary: "Understanding the risks of Zika virus exposure for pregnant women and those trying to conceive, along with prevention strategies.",
    content: [
      "The Zika virus emerged as a significant global health concern due to its association with severe birth defects. Understanding the risks and appropriate precautions is essential for fertility patients and pregnant women.",
      
      "Zika Virus Transmission:",
      "Zika virus is primarily transmitted through the bite of infected Aedes mosquitoes. It can also be transmitted sexually and from mother to fetus during pregnancy. Most people infected with Zika virus are asymptomatic or experience mild symptoms including fever, rash, joint pain, and conjunctivitis.",
      
      "Risks to Pregnancy:",
      "The greatest concern with Zika virus is its impact on fetal development. Zika virus infection during pregnancy can cause:",
      
      "• Microcephaly (abnormally small head and brain)",
      "• Other severe brain defects",
      "• Eye abnormalities",
      "• Hearing loss",
      "• Impaired growth",
      "• Congenital Zika Syndrome (a pattern of birth defects including brain abnormalities, eye defects, joint problems, and muscle tone issues)",
      
      "The risk of birth defects appears highest when infection occurs during the first trimester, but the virus can cause complications throughout pregnancy.",
      
      "Recommendations for Fertility Patients and Pregnant Women:",
      
      "1. Travel Precautions:",
      "• Avoid travel to areas with active Zika transmission when possible",
      "• If travel is necessary, take strict mosquito bite prevention measures",
      "• Check CDC or WHO websites for current Zika travel advisories",
      
      "2. Timing of Pregnancy:",
      "• Women exposed to Zika should wait at least 8 weeks before trying to conceive",
      "• Men exposed to Zika should wait at least 3 months before unprotected sex or providing sperm for assisted reproduction",
      
      "3. For Those Undergoing Fertility Treatment:",
      "• Consider Zika virus testing before beginning treatment if there's potential exposure",
      "• Some fertility centers may require testing for patients who have traveled to Zika-affected areas",
      "• Gamete (egg/sperm) donors should be screened for Zika risk factors",
      
      "4. Prevention Measures:",
      "• Use EPA-registered insect repellent",
      "• Wear long-sleeved shirts and long pants",
      "• Stay in places with air conditioning and window/door screens",
      "• Remove standing water around homes",
      "• Use condoms or abstain from sex if a partner may be infected",
      
      "If you're planning pregnancy or are already pregnant and concerned about potential Zika exposure, consult with your healthcare provider promptly for guidance and testing if appropriate."
    ],
    relatedPosts: [1, 4, 9]
  },
  {
    id: 9,
    slug: "endometriosis-and-pregnancy",
    title: "Endometriosis and Pregnancy",
    date: "NOVEMBER 10, 2016",
    image: "/images/features/Pc1.jpg",
    author: "Dr. Sarah Johnson",
    authorImage: "/images/features/pc11.jpg",
    readTime: "10 min read",
    category: "Pregnancy",
    tags: ["Endometriosis", "Pregnancy", "Women's Health"],
    summary: "What women with endometriosis should know about pregnancy, from conception challenges to managing the condition during pregnancy.",
    content: [
      "For women with endometriosis who become pregnant, understanding how the condition might affect pregnancy—and how pregnancy might affect endometriosis—is important for optimal maternal and fetal health.",
      
      "Endometriosis and Conception:",
      "While endometriosis can make conception more difficult, many women with the condition do become pregnant naturally. For others, fertility treatments such as ovulation induction, intrauterine insemination (IUI), or in vitro fertilization (IVF) may be needed, depending on the severity of the condition and other fertility factors.",
      
      "Effects of Pregnancy on Endometriosis Symptoms:",
      "Many women experience temporary relief from endometriosis symptoms during pregnancy. This is primarily due to the hormonal changes that occur, particularly the absence of menstruation and the high levels of progesterone produced during pregnancy that can suppress endometriosis growth.",
      
      "However, it's important to note that pregnancy is not a 'cure' for endometriosis. While symptoms often improve, the underlying condition remains, and symptoms may return after delivery, especially once menstruation resumes.",
      
      "Pregnancy Complications and Endometriosis:",
      "Research has found that women with endometriosis may have slightly higher risks of certain pregnancy complications:",
      
      "• Miscarriage (approximately 1.5 times higher risk)",
      "• Ectopic pregnancy (particularly if the fallopian tubes are affected by endometriosis)",
      "• Placenta previa (when the placenta covers all or part of the cervix)",
      "• Preterm birth",
      "• Cesarean delivery",
      "• Small for gestational age infants",
      "• Pregnancy-induced hypertension",
      
      "It's important to emphasize that while these risks are statistically higher, the absolute risk remains relatively low, and most women with endometriosis have normal pregnancies and healthy babies.",
      
      "Managing Endometriosis During Pregnancy:",
      
      "1. Prenatal Care:",
      "• Inform your obstetrician about your endometriosis diagnosis",
      "• Consider consulting with a maternal-fetal medicine specialist for high-risk pregnancy care if your endometriosis is severe",
      "• Attend all recommended prenatal appointments for appropriate monitoring",
      
      "2. Pain Management:",
      "• Discuss safe pain management options with your healthcare provider if endometriosis pain persists during pregnancy",
      "• Non-pharmacological approaches like heat therapy, physical therapy, and relaxation techniques may be helpful",
      
      "3. Emotional Support:",
      "• Pregnancy with a chronic condition can be emotionally challenging",
      "• Consider joining support groups for women with endometriosis",
      "• Don't hesitate to discuss mental health concerns with your healthcare team",
      
      "Postpartum Considerations:",
      "After delivery, endometriosis symptoms typically return once menstrual cycles resume. Breastfeeding may delay the return of symptoms since it can postpone the return of menstruation. Discuss your long-term endometriosis management plan with your healthcare provider during your postpartum check-ups."
    ],
    relatedPosts: [1, 4, 7]
  }
];

const BlogDetailPage = () => {
  const { blogSlug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // Check if blogSlug exists
    if (!blogSlug) {
      navigate('/blog');
      return;
    }

    // Find the post by slug
    const blogPost = blogPostsData.find(post => post.slug === blogSlug);
    if (blogPost) {
      setPost(blogPost);
      
      // Find related posts
      if (blogPost.relatedPosts && blogPost.relatedPosts.length > 0) {
        const related = blogPostsData.filter(p => 
          blogPost.relatedPosts.includes(p.id)
        );
        setRelatedPosts(related);
      }
    } else {
      // Redirect to blog page if post not found
      navigate('/blog');
    }
  }, [blogSlug, navigate]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-4">
            <div className="flex justify-center items-center mb-4">
              <Tag color="#ff8460" className="text-white px-3 py-1 mr-2">{post.category}</Tag>
              <span className="text-white flex items-center">
                <ClockCircleOutlined className="mr-1" />{post.readTime}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center justify-center text-white text-sm">
              <span className="mx-2">HOME</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">BLOG</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">{post.category.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              {/* Author Info */}
              <div className="flex items-center mb-8">
                <Avatar 
                  src={post.authorImage} 
                  size={64} 
                  icon={<UserOutlined />} 
                  className="mr-4"
                />
                <div>
                  <Text strong className="block text-lg">{post.author}</Text>
                  <Text type="secondary" className="flex items-center">
                    <CalendarOutlined className="mr-2" /> {post.date}
                  </Text>
                </div>
              </div>

              {/* Content */}
              <div className="blog-content mb-10">
                <Paragraph className="text-lg font-medium mb-8">
                  {post.summary}
                </Paragraph>
                
                {post.content.map((paragraph, index) => (
                  <Paragraph key={index} className="text-gray-700 mb-6">
                    {paragraph}
                  </Paragraph>
                ))}
              </div>

              {/* Tags */}
              <div className="mb-10">
                <div className="flex flex-wrap items-center">
                  <TagOutlined className="mr-2 text-gray-500" />
                  {post.tags.map(tag => (
                    <Tag 
                      key={tag} 
                      className="mr-2 mb-2 px-3 py-1 border-gray-300"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Share */}
              <Divider />
              
              {/* Related Posts - Mobile View */}
              <div className="lg:hidden mb-10">
                <Title level={4} className="mb-6">Related Articles</Title>
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2 }}
                  dataSource={relatedPosts}
                  renderItem={item => (
                    <List.Item>
                      <Link to={`/blog/${item.slug}`}>
                        <Card 
                          hoverable 
                          cover={<img alt={item.title} src={item.image} className="h-48 object-cover" />}
                          className="border border-gray-200"
                        >
                          <Card.Meta 
                            title={item.title} 
                            description={
                              <Space direction="vertical">
                                <Text type="secondary">{item.date}</Text>
                                <Button 
                                  type="text" 
                                  icon={<RightOutlined className="bg-[#ff8460] text-white rounded-full p-1 mr-2" />}
                                  className="text-[#ff8460] hover:text-[#ff6b40] px-0"
                                >
                                  Read More
                                </Button>
                              </Space>
                            } 
                          />
                        </Card>
                      </Link>
                    </List.Item>
                  )}
                />
              </div>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              {/* Related Posts */}
              <div className="hidden lg:block">
                <Card 
                  title="Related Articles" 
                  className="mb-8 border border-gray-200"
                  headStyle={{ borderBottom: '2px solid #ff8460' }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={relatedPosts}
                    renderItem={item => (
                      <List.Item className="border-b last:border-b-0">
                        <Link to={`/blog/${item.slug}`} className="w-full">
                          <div className="flex items-center py-2">
                            <div className="w-20 h-20 mr-4 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <Text strong className="hover:text-[#ff8460] transition-colors">
                                {item.title}
                              </Text>
                              <Text type="secondary" className="block mt-1">
                                {item.date}
                              </Text>
                            </div>
                          </div>
                        </Link>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>

              {/* Categories */}
              <Card 
                title="Categories" 
                className="mb-8 border border-gray-200"
                headStyle={{ borderBottom: '2px solid #ff8460' }}
              >
                <List
                  dataSource={[
                    { name: 'Pregnancy', count: 4 },
                    { name: 'Fertility', count: 3 },
                    { name: 'Women\'s Health', count: 5 },
                    { name: 'Fertility Treatments', count: 2 },
                    { name: 'Health Alerts', count: 1 }
                  ]}
                  renderItem={item => (
                    <List.Item className="border-b last:border-b-0 py-2">
                      <Link to={`/blog`} className="flex justify-between w-full hover:text-[#ff8460] transition-colors">
                        <span>{item.name}</span>
                        <span>({item.count})</span>
                      </Link>
                    </List.Item>
                  )}
                />
              </Card>

              {/* Tags Cloud */}
              <Card 
                title="Popular Tags" 
                className="mb-8 border border-gray-200"
                headStyle={{ borderBottom: '2px solid #ff8460' }}
              >
                <div className="flex flex-wrap">
                  {['Pregnancy', 'Fertility', 'IVF', 'Women\'s Health', 'Endometriosis', 
                    'Motherhood', 'Egg Freezing', 'Reproductive Health', 'Infertility'].map(tag => (
                    <Tag 
                      key={tag} 
                      className="mr-2 mb-2 py-1 px-3 border-gray-300 cursor-pointer hover:border-[#ff8460] hover:text-[#ff8460] transition-colors"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </Card>

              {/* Subscribe */}
              <Card 
                title="Subscribe" 
                className="border border-gray-200"
                headStyle={{ borderBottom: '2px solid #ff8460' }}
              >
                <Paragraph>
                  Get the latest articles and insights from our fertility experts
                </Paragraph>
                <div className="mt-4">
                  <Button 
                    type="primary" 
                    className="w-full bg-[#ff8460] hover:bg-[#ff6b40] border-none"
                    onClick={() => navigate('/contacts')}
                  >
                    Contact Us
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      
      <UserFooter />
    </div>
  );
};

export default BlogDetailPage; 