import { Article, AppLanguage } from '../types';

export const ARTICLES_EN: Article[] = [
  {
    id: 'padukas-significance',
    title: 'The Significance of the Padukas',
    subtitle: 'Understanding the spiritual core of the Wari',
    category: 'Traditions',
    readTime: '6 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOmEuLkUWVytBXWP_3ToAEekVu5lLqStu8nkdB5ZnNihInJw7KQwJdJnesNyyrGv_de83iS_-QoFgfAysZZOQA42vk2FEu7cPKfghHhHXkgUG5j4kuTZBdnwirQb021Cqe6d-v82dIbdhNxsz6ERRpvKANOt_c5RgzfbXXL-H5XdXkBkYSevYcF4LBGeQOja1ezYsXu9WLUpsXX5elzQQpQImK7za1AW57Kwkq6n282bJSKaiJxx3q',
    secondaryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79rABy77QeKG3zXQJfF4g6M8mHNg3FzeNSjctsAJx9w-R9Uqsb4UbYkL930KgY-R01r1z_5RDRjavimDBpMkkTq36tcIDkys4pyOfWJMUXZWP5C_uifawZPQqOABEaLWot7rudUwu7Soos1K0NRSLsjUsPu63PPfDq9tnuPw5HSaW9u9pwvh3GZ_yjOmW6Z-VZrI7keawDetuLh1iDPBoMkps4rh0Ipi8jqDsbve5eaxB8_OLMt7W',
    summary: 'Understanding the spiritual core of the Wari: The silver footprints that carry the essence of the saints.',
    content: [
      {
        heading: 'The Heart of the Journey',
        paragraphs: [
          'At the very center of the vast sea of devotees flowing towards Pandharpur is the Palkhi (palanquin). But the Palkhi itself is merely the vessel. What it carries—and what millions walk hundreds of kilometers to honor—are the Padukas.',
          'The Padukas are silver or wooden representations of the footprints of revered saints, most notably Sant Dnyaneshwar and Sant Tukaram. In the Bhakti tradition, touching or even beholding the feet of a guru is considered the highest form of respect and a way to receive their grace.'
        ],
        infoBox: {
          title: 'Symbolic Presence',
          text: 'The tradition views the Padukas not as mere symbols, but as the living presence of the saint journeying to meet Lord Vitthal. The Warkaris believe they are walking with the saint, acting as their companions on the sacred route.'
        }
      },
      {
        heading: 'Rituals Along the Way',
        paragraphs: [
          'The journey of the Padukas is punctuated by specific, deeply moving rituals:'
        ],
        bulletPoints: {
          items: [
            {
              title: 'Abhishekam (Bathing Ritual)',
              text: 'At designated resting places (mukkam), the Padukas are bathed with sacred water, milk, and panchamrit before being adorned with fresh sandalwood paste and tulsi leaves.',
              icon: 'water_drop'
            },
            {
              title: 'Aarti & Kirtan',
              text: 'Every evening, elaborate aartis are performed before the Padukas, accompanied by the singing of abhangas (devotional poetry) composed by the very saints whose footprints are being venerated.',
              icon: 'music_note'
            },
            {
              title: 'Darshan',
              text: 'Villagers along the route line the streets for hours, offering rangolis, water, and food to the Warkaris, all in exchange for a momentary glimpse (darshan) of the Palkhi and the sacred Padukas.',
              icon: 'diversity_2'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'sant-dnyaneshwar',
    title: 'Sant Dnyaneshwar: The Light of Knowledge',
    subtitle: '13th-century Marathi saint, poet, philosopher and yogi',
    category: 'Spiritual Masters',
    readTime: '5 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJgycDw865Fb4DhiW2KizmUEXOGq2DavMX7Tn5RxibOnneaJDpP3fptkTGz_cIAXymbXItL7UjV6fapQotS7Jm-l0PWpreh-Ghc2KK4NvJ4wPH1skh8xFBs7BHCsSSfG6M4g4wggGZwE6tzRUqhpFPGw9ikY4typwvTraCP1K-8KhhOT2avDeu2ZKzPq2KkOElXxUZUheNduOHcKkUBqn27KHdqQMdPFIzKqsl4b1BPGNErSNlPMJZ',
    summary: 'In a short life of just 21 years, he authored the Dnyaneshwari and the Amrutanubhav, leaving an indelible mark on Marathi literature.',
    content: [
      {
        paragraphs: [
          'Sant Dnyaneshwar, also known as Dnyandev, was a 13th-century Marathi saint, poet, philosopher, and yogi of the Nath Vaishnava tradition. In a short life of just 21 years, he authored the Dnyaneshwari (a commentary on the Bhagavad Gita) and the Amrutanubhav, leaving an indelible mark on Marathi literature and Hindu philosophy.'
        ]
      },
      {
        heading: 'Early Life and Miracles',
        paragraphs: [
          "Born in 1275 in Apegaon, near Paithan in Maharashtra, Dnyaneshwar's life was marked by both hardship and profound spiritual awakening. Orphaned at a young age, he and his siblings faced social ostracism. However, their profound spiritual purity and miraculous acts quickly earned them reverence."
        ],
        quote: {
          text: '"Let the entire world be happy, and let every being be free from misery."',
          source: 'Pasayadan, Dnyaneshwari'
        }
      },
      {
        heading: 'The Dnyaneshwari',
        paragraphs: [
          'Written when he was merely 15 years old, the Dnyaneshwari brought the esoteric teachings of the Bhagavad Gita, then restricted to Sanskrit scholars, to the common people in their native Marathi language. It is celebrated for its poetic beauty, philosophical depth, and accessible metaphors.'
        ],
        infoBox: {
          title: 'Core Teachings',
          text: '• Bhakti (Devotion) as the ultimate path to liberation.\n• Equality of all beings in the eyes of the divine.\n• The importance of inner purity over external rituals.'
        }
      }
    ],
    audio: {
      title: 'Listen to Pasayadan',
      duration: '2:30 mins'
    },
    samadhiLocation: {
      title: 'Samadhi Sanjeevan',
      description: 'Alandi, near Pune, is the sacred site where Sant Dnyaneshwar took Sanjeevan Samadhi in 1296 AD.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgZB1EG2ldri9acvmTCJVk09yvJnzywqNlT3pA9McUNMohV7OF5scg-YTsB_qCe1nT6BS3W4-OaNqF4BlpVhk_wK4mvRRFNN9bszeZyhXfqsEWtnvBSx66DMrYLiBKhxdtArKHUvy9J-IrPB7rIok6rnA-rKwTGgVh95Jd1oqM0hE1baEEoY3Y12rb0emhS5aijcDBn1AzO2s5niXY60YV-THP8_8A-uYoXjwiuSFypLhiNUNjhS9C'
    }
  },
  {
    id: 'mindful-walking',
    title: "A Pilgrim's Guide to Mindful Walking",
    subtitle: 'Maintaining a meditative state while walking hundreds of kilometers',
    category: 'Mindful Walking',
    readTime: '7 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDURzQa97z1wzGM0lmHRKUNDGcUyVsKbp4NwKyuUoryyRamZUls_XEe96mdbiJtWrUMdqJlqedX83LBvU1RO7emZH1KEAoQufCjXU8hR7QF5R0w9Mzoz6umNat6pY14bSgMFaZOA5OnXzK1MgQO2rbG_vECqw0CSUliUBdLoRy8SmKSP-B05FFikZZFh8RN-CCD5YVaMhVfe3n501cbcYbpLimv8xnA-IMucq3LONyXmnZQO6acoAY8',
    summary: 'The Wari is not just a physical journey; it is a profound spiritual exercise requiring endurance and deep inner focus.',
    content: [
      {
        paragraphs: [
          'The Wari is not just a physical journey; it is a profound spiritual exercise. Walking hundreds of kilometers requires more than just physical endurance—it demands a focused, meditative state of mind. This guide explores practical ways to maintain spiritual connection while enduring the physical toll of the pilgrimage.'
        ],
        infoBox: {
          title: 'The Power of Abhangas',
          text: 'Chanting Abhangas (devotional poetry) is central to the Wari experience. The rhythmic singing helps synchronize your breathing with your steps, effectively turning the act of walking into a moving meditation. Focus on the vibration of the words and draw energy from the collective Dindi spirit.'
        }
      },
      {
        heading: 'Physical Sustenance',
        paragraphs: [
          'Spiritual focus is difficult when the body is distressed. Staying hydrated is paramount. Drink water in small, frequent sips rather than large gulps. Wear comfortable, broken-in footwear to prevent blisters that break your meditative concentration.'
        ]
      },
      {
        heading: 'The Spirit of Seva',
        paragraphs: [
          'Seva (selfless service) is the highest form of mindfulness. Helping a fellow pilgrim carrying a heavy load, or offering water, shifts your focus from your own fatigue to the well-being of the community, enriching your spiritual journey.',
          'Remember, the destination of Pandharpur is important, but the transformation happens on the road. By combining practical care for your body with the spiritual practices of chanting and service, every step becomes a prayer.'
        ]
      }
    ]
  },
  {
    id: 'wari-history',
    title: 'The 800-Year History of Wari',
    subtitle: 'A journey of faith, unity, and unwavering devotion',
    category: 'History',
    readTime: '8 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu-2o1vFEoia0AdtzOpXnXnUuxkGm_iz4z34V7RPMQBvn5cOU2izNp9hdNPQijg6Z4tdHSmrAMsq8w6ed9tCwI6ycR75LxIX8ARqCbtvomcZpLZptQy3usaC8D4n-TBk1I6mOi9EzMby86ql8H3tKxQ2kRuUvIO7bOKYi6J491G-vr-OSthBn-gpsZFGM4w_fC0oOfN36cZ66imv2KH2l6CAU661OmUaLHznV_qaiUd_hUb3nmUEPU',
    summary: 'The Pandharpur Wari is not merely a pilgrimage; it is a profound spiritual movement that has shaped the cultural fabric of Maharashtra.',
    content: [
      {
        paragraphs: [
          'The Pandharpur Wari is not merely a pilgrimage; it is a profound spiritual movement that has shaped the cultural and social fabric of Maharashtra. Every year, during the Hindu month of Ashadh (June-July), millions of devotees—known as Warkaris—embark on a grueling yet joyous journey by foot, walking hundreds of kilometers to the holy town of Pandharpur to seek the blessings of Lord Vitthal.'
        ]
      },
      {
        heading: 'The Origins',
        paragraphs: [
          'The roots of the Wari tradition trace back over 800 years. While the exact origins are woven into folklore and devotion, historians agree that it was institutionalized and popularized by the great saints of the Bhakti movement, particularly Sant Dnyaneshwar and Sant Tukaram. The tradition of carrying the padukas in a decorated palanquin (Palkhi) began as a way to physically and spiritually connect the resting places of the saints with Lord Vitthal.',
          "Sant Dnyaneshwar's father is believed to have started the tradition of visiting Pandharpur regularly, but it was Sant Tukaram's son, Narayan Maharaj, who formalized the Palkhi procession in 1685. This transformed individual pilgrimages into a massive, organized communal journey."
        ],
        quote: {
          text: '"The Wari is the heartbeat of rural Maharashtra. It is a time when boundaries dissolve, and the only identity that remains is that of a devotee."',
          source: 'Warkari Tradition Lore'
        }
      },
      {
        heading: 'The Message of Equality',
        paragraphs: [
          'At its core, the Wari is a powerful equalizer. In a society historically fractured by caste, class, and social standing, the Wari stands as a beacon of unity. Within the Dindis (the organized groups of pilgrims), everyone walks together, eats together, and sings the abhangas as one family.',
          'There is no rich or poor, no high caste or low caste—only Warkaris. This profound message of equality and brotherhood was the primary teaching of the Bhakti saints and remains the enduring legacy of the 800-year-old journey today.'
        ]
      }
    ]
  },
  {
    id: 'timeless-rhythm',
    title: 'The Timeless Rhythm of the Wari',
    subtitle: 'Discover the centuries-old tradition uniting millions',
    category: 'Traditions',
    readTime: '8 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZVg7xhv49pd4uWwTPgDJ8q10GQs3nx3a6zKWZdA22B3zuz0E92JZR25z5OulM-1eqlGy3yMVpM9RTf5xFck38T-VY1-9SFVqnVHTaEFVghnRxFBJsth3ct5mFvwFt-w-KOMmBn6X1HaJXzBIz_w6QVvkO6TxJyYhFuYyuk7tAeu2OtAGApe9fZ9-H98ET46xFiijrmKkq2Vqve8Kcvq9hvWVFLRMChyAJBLWBHJTXqsjW6vou9POF',
    summary: 'Discover the centuries-old tradition that unites millions in devotion, song, and unwavering faith on the path to Pandharpur.',
    content: [
      {
        paragraphs: [
          'As the dawn breaks over the Sahyadri ranges, the quiet countryside awakens to the resounding clash of cymbals (Taal), the rhythmic beat of the Mridangam, and the collective roar of "Gyanba Tukaram". This is not an ordinary walk—it is the symphony of millions moving in sacred unison.',
          'Each Dindi follows a precise discipline honed over centuries. The flag bearers (Patakadaris) lead the way, followed by women carrying sacred Tulsi Vrindavans on their heads, followed by the chorus of singers (Vina-karis) and devotees.'
        ]
      }
    ]
  },
  {
    id: 'stories-from-road',
    title: 'Stories from the Road: A Lifetime of Devotion',
    subtitle: 'Interviews with elders on their 50th Wari',
    category: 'Pilgrim Stories',
    readTime: '5 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnklnwOSd0A5hLw0vzjYipIdE1WgUIOI4WtaznrsGcyIr1eMQWYaU_rVM8uhT8IlCuOzqARcaOBJc9WEPKzcPmOzpRD-KhNYnHfzJmmCnkUpjkLIG6EEwu0hdH0V2lLQmtxvPl0--CQVZ4AmUg7-KlSRjBIMaY3aBUcWognIWLiFn1NYfNs480HXlG1_zHbOfj2u9Qvjns2UqwxgK5uXXuHY3HrSBuq8nj9uAFojjBjOoSYMONpGbk',
    summary: 'Heartwarming experiences and reflections from veteran Warkaris who have walked the sacred path for decades.',
    content: [
      {
        paragraphs: [
          '"My feet may ache at seventy-two, but my heart has never felt lighter," says Bapurao Patil from Satara district, walking his 51st consecutive Ashadhi Wari. "When you hear the dindi singing ahead of you, fatigue simply vanishes."',
          'Elderly pilgrims like Bapurao carry minimal personal luggage, relying on the hospitality of villages along the highway and the unshakeable bond shared between fellow travelers.'
        ]
      }
    ]
  },
  {
    id: 'abhangas-tukaram',
    title: 'The Abhangas of Sant Tukaram',
    subtitle: 'Understanding the poetic essence of devotion',
    category: 'Saints',
    readTime: '12 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZvJ-wK-2MTR03QSWDWmAg0sfF6oIDB6sR6jbcP-jgG8paQOnlcXKoYQg4DjAtAIqyFznLw27HzHH64dvDvTRAxlx7GtTf4k1vbJfIBt1_aXSHjhYOOMvBo2hmjBFsRpyL-z3QgLHdHzJjWca65fUwrQcJmSBibEyOWeORjjFDpwK_93k8cfjT83VHWyZJNK5MDDV1WhIhW9NY8v2uQnMwpHbcWW0KxXFT7kDoBOJSx32-dza3w43',
    summary: 'Sant Tukaram Maharaj captured human vulnerability, societal truth, and boundless ecstasy for Vitthal in his timeless abhangs.',
    content: [
      {
        paragraphs: [
          'Sant Tukaram (1608–1649) lived in Dehu, near Pune. Through his over 4,500 abhangs, he championed internal devotion over ritualistic dogma, asserting that God is accessible to every sincere seeker regardless of background.',
          'His verses remain the lifeblood of every Warkari Bhajan session, sung with tears of joy under starlit tents every evening of the 21-day journey.'
        ]
      }
    ]
  },
  {
    id: 'spirit-of-annadaan',
    title: 'The Spirit of Annadaan along the Route',
    subtitle: 'How local villages feed millions for free',
    category: 'Traditions',
    readTime: '6 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Cg6Fmm2XmCSEbu2aWhNwT5ZXadufNJ5bL96ewvY_ALF1y2CyAR6GlDPToUclabp0Jk6S8M32kPMOfnGUFzUKr-HmuHgqJc2xqwow1lJzB-Qiyp-2S_PAwO2D3fcAT21DquncpZFCA10svM3EwPZdMudHxVCQnohtRZ9TPh5EFLFxBQt9Q09SkUIQLs8gjvnDQOci4VW8YOfdM6QhhC3RKCxdxqP8BsIWxprHXB_TCfK-mP_R885_',
    summary: 'Villages across Maharashtra pool grains, vegetables, and milk to serve wholesome khichdi, bhakri, and buttermilk to all pilgrims without charge.',
    content: [
      {
        paragraphs: [
          'One of the most awe-inspiring aspects of the Wari is the spontaneous hospitality of rural Maharashtra. Thousands of community kitchens (Annachhatras) operate around the clock.',
          'Farmers gladly open their granaries and homes, believing that serving a Warkari is equivalent to serving Lord Panduranga Himself.'
        ]
      }
    ]
  }
];

export const ARTICLES_MR: Article[] = [
  {
    id: 'padukas-significance',
    title: 'श्री संतांच्या पादुकांचे अलौकिक महत्त्व',
    subtitle: 'पंढरीच्या वारीचा आध्यात्मिक प्राण आणि परंपरा',
    category: 'परंपरा',
    readTime: '६ मिनिटे वाचन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOmEuLkUWVytBXWP_3ToAEekVu5lLqStu8nkdB5ZnNihInJw7KQwJdJnesNyyrGv_de83iS_-QoFgfAysZZOQA42vk2FEu7cPKfghHhHXkgUG5j4kuTZBdnwirQb021Cqe6d-v82dIbdhNxsz6ERRpvKANOt_c5RgzfbXXL-H5XdXkBkYSevYcF4LBGeQOja1ezYsXu9WLUpsXX5elzQQpQImK7za1AW57Kwkq6n282bJSKaiJxx3q',
    secondaryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79rABy77QeKG3zXQJfF4g6M8mHNg3FzeNSjctsAJx9w-R9Uqsb4UbYkL930KgY-R01r1z_5RDRjavimDBpMkkTq36tcIDkys4pyOfWJMUXZWP5C_uifawZPQqOABEaLWot7rudUwu7Soos1K0NRSLsjUsPu63PPfDq9tnuPw5HSaW9u9pwvh3GZ_yjOmW6Z-VZrI7keawDetuLh1iDPBoMkps4rh0Ipi8jqDsbve5eaxB8_OLMt7W',
    summary: 'वारीचा मूळ आत्मा म्हणजे संतांच्या पादुका. लाखो वारकरी शेकडो मैल ज्या प्रेमाने चालतात, तो संतांच्या चरणस्पर्शाचा अद्भुत महिमा.',
    content: [
      {
        heading: 'वारीचा प्राण आणि केंद्रबिंदू',
        paragraphs: [
          'पंढरपूरच्या दिशेने वाहणाऱ्या लाखो वारकऱ्यांच्या जनसागराचे केंद्रस्थान म्हणजे श्री पालखी सोहळा. पालखी हे केवळ एक साधन आहे; परंतु त्या पालखीत विराजमान असलेल्या संतांच्या पवित्र पादुका हा संपूर्ण वारीचा चैतन्यमय प्राण आहे.',
          'संत ज्ञानेश्वर महाराज आणि संत तुकाराम महाराज यांच्या रौप्य किंवा काष्ठ पादुकांचे पूजन भक्तिभावाने केले जाते. वारकरी संप्रदायात संतांच्या चरणांचे दर्शन व स्पर्श हा परम ईश्वरी कृपेचा सर्वोच्च साक्षात्कार मानला जातो.'
        ],
        infoBox: {
          title: 'साक्षात संतांची उपस्थिती',
          text: 'वारकरी परंपरेनुसार पादुका हे केवळ प्रतीक नसून प्रत्यक्ष संत स्वतः विठुरायाला भेटण्यासाठी चालत आहेत अशी वारकऱ्यांची अढळ श्रद्धा आहे. प्रत्येक वारकरी स्वतःला संतांचा सहप्रवासी मानून भक्तीत लीन होतो.'
        }
      },
      {
        heading: 'मुक्कामावरील नित्य विधी',
        paragraphs: [
          'वारीच्या प्रवासात दररोज ठरावीक पवित्र विधी पार पाडले जातात:'
        ],
        bulletPoints: {
          items: [
            {
              title: 'पादुका अभिषेक व पूजा',
              text: 'प्रत्येक मुक्कामावर पवित्र उदक, दूध व पंचामृताने पादुकांना स्नान घालून ताजे चंदन आणि तुळशीपत्र अर्पण केले जाते.',
              icon: 'water_drop'
            },
            {
              title: 'धूपारती व कीर्तन',
              text: 'दररोज सायंकाळी पालखीसमोर भव्य धूपारती होते आणि टाळ-मृदुंगाच्या गजरात संतांचे अमृततुल्य अभंग गायले जातात.',
              icon: 'music_note'
            },
            {
              title: 'चरणस्पर्श व दर्शन',
              text: 'मार्गावरील गावातील अबालवृद्ध रांगोळ्या काढून, पाणी व भोजन देऊन पालखीचे व पादुकांचे पावन दर्शन घेतात.',
              icon: 'diversity_2'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'sant-dnyaneshwar',
    title: 'संत ज्ञानेश्वर महाराज: ज्ञानसूर्य व माउली',
    subtitle: '१३व्या शतकातील महान संत, तत्त्वज्ञ, कवी आणि योगी',
    category: 'संत परंपरा',
    readTime: '५ मिनिटे वाचन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJgycDw865Fb4DhiW2KizmUEXOGq2DavMX7Tn5RxibOnneaJDpP3fptkTGz_cIAXymbXItL7UjV6fapQotS7Jm-l0PWpreh-Ghc2KK4NvJ4wPH1skh8xFBs7BHCsSSfG6M4g4wggGZwE6tzRUqhpFPGw9ikY4typwvTraCP1K-8KhhOT2avDeu2ZKzPq2KkOElXxUZUheNduOHcKkUBqn27KHdqQMdPFIzKqsl4b1BPGNErSNlPMJZ',
    summary: 'केवळ २१ वर्षांच्या अलौकिक आयुष्यात त्यांनी भावार्थदीपिका (ज्ञानेश्वरी) व अमृतानुभव रचून मराठी भाषेला विश्वगौरव मिळवून दिला.',
    content: [
      {
        paragraphs: [
          'संत ज्ञानेश्वर (ज्ञानेश्वरा माउली) हे नाथ आणि वारकरी परंपरेचे सर्वोच्च आधारस्तंभ आहेत. वयाच्या अवघ्या २१ व्या वर्षी त्यांनी गीतेवर मराठीत अप्रतिम भाष्य करणारी ज्ञानेश्वरी रचून अध्यात्मज्ञान सर्वसामान्यांसाठी खुले केले.'
        ]
      },
      {
        heading: 'जीवनचरित्र आणि विश्वकल्याण विचार',
        paragraphs: [
          '१२७५ मध्ये पैठणजवळील आपेगाव येथे जन्मलेल्या माउलींनी बालपणी अनेक सामाजिक हालअपेष्टा सहन केल्या, पण मनात कधीही कटुता न ठेवता जगाला केवळ प्रेमाचा आणि करुणेचा संदेश दिला.'
        ],
        quote: {
          text: '‘जे खळांची व्यंकटी सांडो । तया सत्कर्मीं रती वाढो । भूतां परस्परे पडो । मैत्र जीवांचे ॥’',
          source: 'पसायदान, ज्ञानेश्वरी'
        }
      },
      {
        heading: 'ज्ञानेश्वरीचा संदेश',
        paragraphs: [
          'संस्कृतमधील कठीण तत्त्वज्ञान प्राकृत मराठी भाषेत आणून त्यांनी भक्ती, समता आणि आंतरिक शुद्धतेचा राजमार्ग दाखवला.'
        ],
        infoBox: {
          title: 'माउलींची प्रमुख शिकवण',
          text: '• ईश्वर सर्व प्राणिमात्रांमध्ये समभावाने वास करतो.\n• कर्म, ज्ञान आणि भक्तीचा सुंदर समन्वय.\n• जगातील सर्व दुःखांचे निवारण व्हावे हा विश्वकल्याणाचा ध्यास.'
        }
      }
    ],
    audio: {
      title: 'पसायदान ऐका',
      duration: '२:३० मिनिटे'
    },
    samadhiLocation: {
      title: 'संजीवन समाधी मंदिर',
      description: 'आळंदी, पुणे - जिथे संत ज्ञानेश्वर महाराजांनी इ.स. १२९६ मध्ये संजीवन समाधी घेतली.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgZB1EG2ldri9acvmTCJVk09yvJnzywqNlT3pA9McUNMohV7OF5scg-YTsB_qCe1nT6BS3W4-OaNqF4BlpVhk_wK4mvRRFNN9bszeZyhXfqsEWtnvBSx66DMrYLiBKhxdtArKHUvy9J-IrPB7rIok6rnA-rKwTGgVh95Jd1oqM0hE1baEEoY3Y12rb0emhS5aijcDBn1AzO2s5niXY60YV-THP8_8A-uYoXjwiuSFypLhiNUNjhS9C'
    }
  },
  {
    id: 'mindful-walking',
    title: 'सजग वारी चालणे: वारकरी ध्यान मार्गदर्शिका',
    subtitle: 'शेकडो किलोमीटरची पायी यात्रा आणि मनाची शांतता',
    category: 'सजग चालणे',
    readTime: '७ मिनिटे वाचन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDURzQa97z1wzGM0lmHRKUNDGcUyVsKbp4NwKyuUoryyRamZUls_XEe96mdbiJtWrUMdqJlqedX83LBvU1RO7emZH1KEAoQufCjXU8hR7QF5R0w9Mzoz6umNat6pY14bSgMFaZOA5OnXzK1MgQO2rbG_vECqw0CSUliUBdLoRy8SmKSP-B05FFikZZFh8RN-CCD5YVaMhVfe3n501cbcYbpLimv8xnA-IMucq3LONyXmnZQO6acoAY8',
    summary: 'वारी ही केवळ शारीरिक चालणे नसून ते एक चालते-बोलते गतिमान ध्यान आहे. नामस्मरण आणि श्वासाचा ताळमेळ कसा साधावा हे जाणून घ्या.',
    content: [
      {
        paragraphs: [
          'वारी ही केवळ पायी चालण्याची परीक्षा नसून ती एक गहन आध्यात्मिक साधना आहे. शेकडो किलोमीटर चालताना शरीराचा थकवा विसरून मन विठ्ठलमय ठेवणे हीच वारीची खरी कला आहे.'
        ],
        infoBox: {
          title: 'अभंग गायनाची शक्ती',
          text: 'नामस्मरण आणि अभंग म्हणत चालल्याने श्वास आणि पावलांची लय एकरूप होते. यामुळे शारीरिक थकवा जाणवत नाही आणि मन सतत आनंदी राहते.'
        }
      },
      {
        heading: 'शारीरिक काळजी आणि आरोग्य',
        paragraphs: [
          'प्रवासात सतत थोडे-थोडे पाणी पिऊन डिहायड्रेशन टाळावे. योग्य पादत्राणे वापरावीत आणि पायाला फोड आल्यास त्वरित सेवा पथकाकडून मलमपट्टी करून घ्यावी.'
        ]
      },
      {
        heading: 'निःस्वार्थ सेवेचा भाव',
        paragraphs: [
          'इतर थकलेल्या वारकऱ्याला मदत करणे, पाणी देणे हीच खरी भगवंताची सेवा आहे. या सेवेने अहंकार गळून पडतो आणि अंतःकरण निर्मळ होते.'
        ]
      }
    ]
  },
  {
    id: 'wari-history',
    title: 'पंढरीच्या वारीचा ८०० वर्षांचा वैभवशाली इतिहास',
    subtitle: 'भक्ती, समता आणि अखंड परंपरेचा अलौकिक प्रवास',
    category: 'इतिहास',
    readTime: '८ मिनिटे वाचन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu-2o1vFEoia0AdtzOpXnXnUuxkGm_iz4z34V7RPMQBvn5cOU2izNp9hdNPQijg6Z4tdHSmrAMsq8w6ed9tCwI6ycR75LxIX8ARqCbtvomcZpLZptQy3usaC8D4n-TBk1I6mOi9EzMby86ql8H3tKxQ2kRuUvIO7bOKYi6J491G-vr-OSthBn-gpsZFGM4w_fC0oOfN36cZ66imv2KH2l6CAU661OmUaLHznV_qaiUd_hUb3nmUEPU',
    summary: 'महाराष्ट्राच्या सामाजिक व सांस्कृतिक जीवनाला दिशा देणाऱ्या वारी परंपरेचा मूळ उगम आणि पालखी सोहळ्याचा विकास.',
    content: [
      {
        paragraphs: [
          'पंढरपूरची आषाढी वारी ही जगातील सर्वात जुनी आणि अद्वितीय शांततापूर्ण पदयात्रा आहे. आषाढ शुद्ध एकादशीला पांडुरंगाच्या दर्शनासाठी महाराष्ट्राच्या कानाकोपऱ्यातून लाखो वारकरी पायी चालतात.'
        ]
      },
      {
        heading: 'वारीचा उगम आणि पालखी सोहळा',
        paragraphs: [
          'वारीची परंपरा ८०० वर्षांहून अधिक प्राचीन आहे. संत ज्ञानदेवांचे पूर्वजही पंढरीची वारी करत असत. १६८५ मध्ये संत तुकाराम महाराजांचे कनिष्ठ सुपुत्र नारायण महाराज यांनी पालखी सोहळ्याची शिस्तबद्ध सुरुवात केली.'
        ],
        quote: {
          text: '‘आधीं रचिली पंढरी । मग वैकुंठ नगरी ॥’',
          source: 'संत नामदेव महाराज'
        }
      },
      {
        heading: 'समतेचा आणि बंधुभावाचा संदेश',
        paragraphs: [
          'जातीभेद, श्रीमंत-गरीब असा कोणताही भेद न बाळगता सर्वजण एकाच पंगतीत जेवतात आणि हातात हात घालून फेर धरतात. वारीने समाजाला समतेचे अमूल्य संस्कार दिले आहेत.'
        ]
      }
    ]
  },
  {
    id: 'timeless-rhythm',
    title: 'वारीचा अखंड नाद: टाळ, मृदुंग आणि नामाचा गजर',
    subtitle: 'लाखो पावले आणि एकाच सुरात विठ्ठल नामाचा जयघोष',
    category: 'परंपरा',
    readTime: '८ मिनिटे वाचन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZVg7xhv49pd4uWwTPgDJ8q10GQs3nx3a6zKWZdA22B3zuz0E92JZR25z5OulM-1eqlGy3yMVpM9RTf5xFck38T-VY1-9SFVqnVHTaEFVghnRxFBJsth3ct5mFvwFt-w-KOMmBn6X1HaJXzBIz_w6QVvkO6TxJyYhFuYyuk7tAeu2OtAGApe9fZ9-H98ET46xFiijrmKkq2Vqve8Kcvq9hvWVFLRMChyAJBLWBHJTXqsjW6vou9POF',
    summary: 'पहाटेच्या काकडारतीपासून ते रात्रीच्या शेजारतीपर्यंत चालणारा वारीचा नित्यनेम आणि शिस्तबद्ध दिंडी व्यवस्था.',
    content: [
      {
        paragraphs: [
          'पहाटेच्या धुक्यात सह्याद्रीच्या डोंगररांगांमध्ये जेव्हा टाळांचा खणखणाट आणि मृदुंगाची थाप ऐकू येते, तेव्हा अंगावर रोमांच उभे राहतात. ‘ज्ञानोबा माउली तुकाराम’च्या जयघोषात लाखो पावले एकाच लयीत पडतात.'
        ]
      }
    ]
  },
  {
    id: 'stories-from-road',
    title: 'वारीच्या वाटेवरील अनुभव: ५० वर्षांची अखंड निष्ठा',
    subtitle: 'ज्येष्ठ वारकऱ्यांच्या आठवणी आणि भक्तिगाथा',
    category: 'वारकरी अनुभव',
    readTime: '५ मिनिटे वाचन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnklnwOSd0A5hLw0vzjYipIdE1WgUIOI4WtaznrsGcyIr1eMQWYaU_rVM8uhT8IlCuOzqARcaOBJc9WEPKzcPmOzpRD-KhNYnHfzJmmCnkUpjkLIG6EEwu0hdH0V2lLQmtxvPl0--CQVZ4AmUg7-KlSRjBIMaY3aBUcWognIWLiFn1NYfNs480HXlG1_zHbOfj2u9Qvjns2UqwxgK5uXXuHY3HrSBuq8nj9uAFojjBjOoSYMONpGbk',
    summary: 'दशकन्‌दशके वारी चालणाऱ्या ज्येष्ठ माउलींचे हृदयस्पर्शी अनुभव आणि विठ्ठल भेटीची अनावर ओढ.',
    content: [
      {
        paragraphs: [
          '“वय वर्षे बहात्तर झाले तरी दिंडी पुढे निघाली की अंगात कोणती शक्ती संचारते ते सांगता येत नाही,” सातारा जिल्ह्यातील बापूराव पाटील सांगतात, ज्यांची ही ५१ वी अखंड वारी आहे.'
        ]
      }
    ]
  },
  {
    id: 'abhangas-tukaram',
    title: 'संत तुकाराम महाराजांचे प्रासादिक अभंग',
    subtitle: 'प्रत्येक वारकऱ्याच्या हृदयातील भक्तीचे अमृत बोल',
    category: 'संत परंपरा',
    readTime: '१२ मिनिटे वाचन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZvJ-wK-2MTR03QSWDWmAg0sfF6oIDB6sR6jbcP-jgG8paQOnlcXKoYQg4DjAtAIqyFznLw27HzHH64dvDvTRAxlx7GtTf4k1vbJfIBt1_aXSHjhYOOMvBo2hmjBFsRpyL-z3QgLHdHzJjWca65fUwrQcJmSBibEyOWeORjjFDpwK_93k8cfjT83VHWyZJNK5MDDV1WhIhW9NY8v2uQnMwpHbcWW0KxXFT7kDoBOJSx32-dza3w43',
    summary: 'जगद्गुरु संत तुकाराम महाराजांच्या साध्या, सोप्या आणि मनाला भिडणाऱ्या अभंगवाणीचा वारीतील अनोखा महिमा.',
    content: [
      {
        paragraphs: [
          'देहूचे संत तुकाराम महाराज यांनी साडेचार हजारांहून अधिक अभंगांची रचना केली. त्यांचे अभंग हे प्रत्येक वारकऱ्याचा श्वास आहेत. बाह्य अवडंबरापेक्षा अंतरीची भक्ती श्रेष्ठ आहे हा त्यांचा मुख्य उपदेश होता.'
        ]
      }
    ]
  },
  {
    id: 'spirit-of-annadaan',
    title: 'वाटेवरील अखंड अन्नदानाचा महिमा',
    subtitle: 'गावोगावी वारकऱ्यांसाठी उभी राहणारी मायेची अन्नछत्रे',
    category: 'परंपरा',
    readTime: '६ मिनिटे वाचन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Cg6Fmm2XmCSEbu2aWhNwT5ZXadufNJ5bL96ewvY_ALF1y2CyAR6GlDPToUclabp0Jk6S8M32kPMOfnGUFzUKr-HmuHgqJc2xqwow1lJzB-Qiyp-2S_PAwO2D3fcAT21DquncpZFCA10svM3EwPZdMudHxVCQnohtRZ9TPh5EFLFxBQt9Q09SkUIQLs8gjvnDQOci4VW8YOfdM6QhhC3RKCxdxqP8BsIWxprHXB_TCfK-mP_R885_',
    summary: 'वारीच्या संपूर्ण मार्गावर ग्रामस्थ व स्वयंसेवी संस्था लाखो वारकऱ्यांना मोफत गरम खिचडी, भाकरी, चहा आणि ताक कसे प्रेमाने देतात.',
    content: [
      {
        paragraphs: [
          'वारीतील सर्वात सुंदर दृश्य म्हणजे ग्रामीण महाराष्ट्राचे औदार्य. शेतकरी आणि ग्रामस्थ स्वतःचे घर आणि कोठारे वारकऱ्यांसाठी उघडी करतात, कारण वारकऱ्याची सेवा हीच विठ्ठल सेवा मानली जाते.'
        ]
      }
    ]
  }
];

export const ARTICLES_HI: Article[] = [
  {
    id: 'padukas-significance',
    title: 'श्री संतों की पादुकाओं का अलौकिक महत्व',
    subtitle: 'पंढरपुर वारी यात्रा का आध्यात्मिक प्राण और परंपरा',
    category: 'परंपराएं',
    readTime: '६ मिनट पठन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOmEuLkUWVytBXWP_3ToAEekVu5lLqStu8nkdB5ZnNihInJw7KQwJdJnesNyyrGv_de83iS_-QoFgfAysZZOQA42vk2FEu7cPKfghHhHXkgUG5j4kuTZBdnwirQb021Cqe6d-v82dIbdhNxsz6ERRpvKANOt_c5RgzfbXXL-H5XdXkBkYSevYcF4LBGeQOja1ezYsXu9WLUpsXX5elzQQpQImK7za1AW57Kwkq6n282bJSKaiJxx3q',
    secondaryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79rABy77QeKG3zXQJfF4g6M8mHNg3FzeNSjctsAJx9w-R9Uqsb4UbYkL930KgY-R01r1z_5RDRjavimDBpMkkTq36tcIDkys4pyOfWJMUXZWP5C_uifawZPQqOABEaLWot7rudUwu7Soos1K0NRSLsjUsPu63PPfDq9tnuPw5HSaW9u9pwvh3GZ_yjOmW6Z-VZrI7keawDetuLh1iDPBoMkps4rh0Ipi8jqDsbve5eaxB8_OLMt7W',
    summary: 'वारी का मूल केंद्र है संतों की पादुकाएं। लाखों भक्त जिस अगाध निष्ठा से पदयात्रा करते हैं, वह संतों के चरणों की महिमा है।',
    content: [
      {
        heading: 'यात्रा का प्राण और केंद्रबिंदु',
        paragraphs: [
          'पंढरपुर की ओर बहते लाखों श्रद्धालुओं के जनसागर का केंद्र श्री पालकी सोहळा है। पालकी में विराजमान संतों की पवित्र पादुकाएं पूरी यात्रा का आध्यात्मिक प्राण हैं।',
          'संत ज्ञानेश्वर महाराज और संत तुकाराम महाराज की पादुकाओं का पूजन किया जाता है। भक्ति परंपरा में संतों के चरणस्पर्श को परमात्मा की असीम कृपा माना गया है।'
        ],
        infoBox: {
          title: 'साक्षात संतों की उपस्थिति',
          text: 'वारकरी परंपरा में मान्यता है कि पादुकाएं मात्र प्रतीक नहीं हैं, बल्कि स्वयं संत भगवान विट्ठल से मिलने यात्रा कर रहे हैं और हम उनके सहयात्री हैं।'
        }
      },
      {
        heading: 'मार्ग के नित्य पावन अनुष्ठान',
        paragraphs: [
          'यात्रा में प्रतिदिन निर्धारित अनुष्ठान संपन्न होते हैं:'
        ],
        bulletPoints: {
          items: [
            {
              title: 'पादुका अभिषेक',
              text: 'पवित्र जल, दूध और पंचामृत से पादुकाओं का स्नान कराकर ताजा चंदन और तुलसी पत्र अर्पित किए जाते हैं।',
              icon: 'water_drop'
            },
            {
              title: 'धूपारती व संकीर्तन',
              text: 'प्रतिदिन सायंकाल पालकी के समक्ष भव्य धूपारती और टाळ-मृदंग की थाप पर अभंग गाए जाते हैं।',
              icon: 'music_note'
            },
            {
              title: 'दर्शन व चरणस्पर्श',
              text: 'गांवों के लोग रंगोली बनाकर और भोजन-जल अर्पित कर पादुकाओं का पावन दर्शन प्राप्त करते हैं।',
              icon: 'diversity_2'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'sant-dnyaneshwar',
    title: 'संत ज्ञानेश्वर महाराज: ज्ञान का सूर्य',
    subtitle: '१३वीं शताब्दी के महान संत, दार्शनिक, कवि और योगी',
    category: 'संत परंपरा',
    readTime: '५ मिनट पठन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJgycDw865Fb4DhiW2KizmUEXOGq2DavMX7Tn5RxibOnneaJDpP3fptkTGz_cIAXymbXItL7UjV6fapQotS7Jm-l0PWpreh-Ghc2KK4NvJ4wPH1skh8xFBs7BHCsSSfG6M4g4wggGZwE6tzRUqhpFPGw9ikY4typwvTraCP1K-8KhhOT2avDeu2ZKzPq2KkOElXxUZUheNduOHcKkUBqn27KHdqQMdPFIzKqsl4b1BPGNErSNlPMJZ',
    summary: 'मात्र २१ वर्ष की अल्पायु में ज्ञानेश्वरी और अमृतानुभव की रचना कर जन-जन को भक्ति का मार्ग दिखाया।',
    content: [
      {
        paragraphs: [
          'संत ज्ञानेश्वर (माउली) वारकरी संप्रदाय के प्राण हैं। उन्होंने श्रीमद्भगवद्गीता का प्राकृत जनभाषा में सरल अनुवाद ‘ज्ञानेश्वरी’ रचकर अध्यात्म ज्ञान को सर्वसुलभ बनाया।'
        ]
      },
      {
        heading: 'जीवन और विश्वकल्याण संदेश',
        paragraphs: [
          '१२७५ में आपेगांव में जन्मे ज्ञानेश्वर महाराज ने सांसारिक कष्टों के बावजूद विश्व के समस्त जीवों के कल्याण की प्रार्थना की।'
        ],
        quote: {
          text: '“समस्त सृष्टि में सत्कर्म की भावना बढ़े और सभी जीवों में परस्पर मैत्री का भाव जागृत हो।”',
          source: 'पसायदान, ज्ञानेश्वरी'
        }
      }
    ],
    audio: {
      title: 'पसायदान सुनें',
      duration: '२:३० मिनट'
    },
    samadhiLocation: {
      title: 'संजीवन समाधि मंदिर',
      description: 'आळंदी (पुणे) - जहां संत ज्ञानेश्वर महाराज ने १२९६ ई. में संजीवन समाधि ली थी।',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgZB1EG2ldri9acvmTCJVk09yvJnzywqNlT3pA9McUNMohV7OF5scg-YTsB_qCe1nT6BS3W4-OaNqF4BlpVhk_wK4mvRRFNN9bszeZyhXfqsEWtnvBSx66DMrYLiBKhxdtArKHUvy9J-IrPB7rIok6rnA-rKwTGgVh95Jd1oqM0hE1baEEoY3Y12rb0emhS5aijcDBn1AzO2s5niXY60YV-THP8_8A-uYoXjwiuSFypLhiNUNjhS9C'
    }
  },
  {
    id: 'mindful-walking',
    title: 'सचेत पदयात्रा: वारकरी ध्यान मार्गदर्शिका',
    subtitle: 'सैकड़ों किलोमीटर की यात्रा में मानसिक शांति कैसे बनाए रखें',
    category: 'सजग पदयात्रा',
    readTime: '७ मिनट पठन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDURzQa97z1wzGM0lmHRKUNDGcUyVsKbp4NwKyuUoryyRamZUls_XEe96mdbiJtWrUMdqJlqedX83LBvU1RO7emZH1KEAoQufCjXU8hR7QF5R0w9Mzoz6umNat6pY14bSgMFaZOA5OnXzK1MgQO2rbG_vECqw0CSUliUBdLoRy8SmKSP-B05FFikZZFh8RN-CCD5YVaMhVfe3n501cbcYbpLimv8xnA-IMucq3LONyXmnZQO6acoAY8',
    summary: 'वारी केवल शारीरिक यात्रा नहीं है, बल्कि एक गतिमान ध्यान है। नामस्मरण और कदमों का सामंजस्य साधना सीखें।',
    content: [
      {
        paragraphs: [
          'वारी एक अनूठी आध्यात्मिक साधना है। लगातार चलने पर शरीर की थकान मिटाने के लिए निरंतर नामस्मरण सबसे उत्तम उपाय है।'
        ],
        infoBox: {
          title: 'अभंग गायन का प्रभाव',
          text: 'सामूहिक भजन और अभंग गाने से श्वास और कदमों की गति सहज हो जाती है, जिससे थकान का अनुभव नहीं होता।'
        }
      }
    ]
  },
  {
    id: 'wari-history',
    title: 'पंढरपुर वारी का ८०० वर्षों का गौरवशाली इतिहास',
    subtitle: 'आस्था, समानता और भक्ति की अविरल धारा',
    category: 'इतिहास',
    readTime: '८ मिनट पठन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu-2o1vFEoia0AdtzOpXnXnUuxkGm_iz4z34V7RPMQBvn5cOU2izNp9hdNPQijg6Z4tdHSmrAMsq8w6ed9tCwI6ycR75LxIX8ARqCbtvomcZpLZptQy3usaC8D4n-TBk1I6mOi9EzMby86ql8H3tKxQ2kRuUvIO7bOKYi6J491G-vr-OSthBn-gpsZFGM4w_fC0oOfN36cZ66imv2KH2l6CAU661OmUaLHznV_qaiUd_hUb3nmUEPU',
    summary: 'वारी परंपरा का इतिहास और संत तुकाराम महाराज के सुपुत्र द्वारा व्यवस्थित पालखी सोहळा का विकास।',
    content: [
      {
        paragraphs: [
          'आषाढी वारी विश्व की सबसे बड़ी और शांतिपूर्ण पदयात्राओं में से एक है। १६८५ में संत तुकाराम महाराज के पुत्र नारायण महाराज ने पालकी परंपरा को व्यवस्थित स्वरूप दिया।'
        ]
      }
    ]
  },
  {
    id: 'timeless-rhythm',
    title: 'वारी की अखंड लय: झांझ, मृदंग और नाम गूंज',
    subtitle: 'लाखों श्रद्धालु और एक स्वर में विट्ठल नाम का जयघोष',
    category: 'परंपराएं',
    readTime: '८ मिनट पठन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZVg7xhv49pd4uWwTPgDJ8q10GQs3nx3a6zKWZdA22B3zuz0E92JZR25z5OulM-1eqlGy3yMVpM9RTf5xFck38T-VY1-9SFVqnVHTaEFVghnRxFBJsth3ct5mFvwFt-w-KOMmBn6X1HaJXzBIz_w6QVvkO6TxJyYhFuYyuk7tAeu2OtAGApe9fZ9-H98ET46xFiijrmKkq2Vqve8Kcvq9hvWVFLRMChyAJBLWBHJTXqsjW6vou9POF',
    summary: 'प्रभात की काकड़ आरती से लेकर रात्रि की शयन आरती तक वारी का नित्य नियम और अनुशासन।',
    content: [
      {
        paragraphs: [
          'प्रभात बेला में झांझ और मृदंग की मधुर ध्वनि के साथ "ज्ञानोबा माउली तुकाराम" के जयकारे के साथ सारा वातावरण भक्तिमय हो जाता है।'
        ]
      }
    ]
  },
  {
    id: 'stories-from-road',
    title: 'मार्ग के संस्मरण: ५० वर्षों की अटूट निष्ठा',
    subtitle: 'वरिष्ठ वारकरियों के भावपूर्ण अनुभव',
    category: 'यात्री अनुभव',
    readTime: '५ मिनट पठन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnklnwOSd0A5hLw0vzjYipIdE1WgUIOI4WtaznrsGcyIr1eMQWYaU_rVM8uhT8IlCuOzqARcaOBJc9WEPKzcPmOzpRD-KhNYnHfzJmmCnkUpjkLIG6EEwu0hdH0V2lLQmtxvPl0--CQVZ4AmUg7-KlSRjBIMaY3aBUcWognIWLiFn1NYfNs480HXlG1_zHbOfj2u9Qvjns2UqwxgK5uXXuHY3HrSBuq8nj9uAFojjBjOoSYMONpGbk',
    summary: 'दशकों से निरंतर वारी करने वाले बुजुर्ग वारकरियों के प्रेरक अनुभव।',
    content: [
      {
        paragraphs: [
          '“आयु भले बहत्तर वर्ष हो गई हो, परंतु दिंडी का स्वर सुनते ही मन में असीम ऊर्जा भर जाती है।”'
        ]
      }
    ]
  },
  {
    id: 'abhangas-tukaram',
    title: 'संत तुकाराम महाराज के मधुर अभंग',
    subtitle: 'हर वारकरी के हृदय में बसने वाले भक्ति के अमृत वचन',
    category: 'संत परंपरा',
    readTime: '१२ मिनट पठन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZvJ-wK-2MTR03QSWDWmAg0sfF6oIDB6sR6jbcP-jgG8paQOnlcXKoYQg4DjAtAIqyFznLw27HzHH64dvDvTRAxlx7GtTf4k1vbJfIBt1_aXSHjhYOOMvBo2hmjBFsRpyL-z3QgLHdHzJjWca65fUwrQcJmSBibEyOWeORjjFDpwK_93k8cfjT83VHWyZJNK5MDDV1WhIhW9NY8v2uQnMwpHbcWW0KxXFT7kDoBOJSx32-dza3w43',
    summary: 'जगद्गुरु संत तुकाराम महाराज के अमर अभंगों का महत्व।',
    content: [
      {
        paragraphs: [
          'संत तुकाराम महाराज ने साढ़े चार हजार से अधिक अभंगों की रचना की, जो आज भी वारी में हर यात्री के कंठ का हार हैं।'
        ]
      }
    ]
  },
  {
    id: 'spirit-of-annadaan',
    title: 'मार्ग में अन्नदान की पावन परंपरा',
    subtitle: 'गांवों द्वारा लाखों श्रद्धालुओं को निःशुल्क प्रसाद सेवा',
    category: 'परंपराएं',
    readTime: '६ मिनट पठन',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Cg6Fmm2XmCSEbu2aWhNwT5ZXadufNJ5bL96ewvY_ALF1y2CyAR6GlDPToUclabp0Jk6S8M32kPMOfnGUFzUKr-HmuHgqJc2xqwow1lJzB-Qiyp-2S_PAwO2D3fcAT21DquncpZFCA10svM3EwPZdMudHxVCQnohtRZ9TPh5EFLFxBQt9Q09SkUIQLs8gjvnDQOci4VW8YOfdM6QhhC3RKCxdxqP8BsIWxprHXB_TCfK-mP_R885_',
    summary: 'ग्रामीण क्षेत्रों में वारकरियों के लिए भोजन, चाय और जल की निःस्वार्थ सेवा।',
    content: [
      {
        paragraphs: [
          'वारी में ग्रामीण जनता वारकरी की सेवा को साक्षात पांडुरंग की सेवा मानकर अन्नछत्र चलाती है।'
        ]
      }
    ]
  }
];

export function getArticlesByLanguage(lang: AppLanguage): Article[] {
  if (lang === 'mr') return ARTICLES_MR;
  if (lang === 'hi') return ARTICLES_HI;
  return ARTICLES_EN;
}
