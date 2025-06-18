-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 18 juin 2025 à 22:52
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cms`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Admin', 'admin@emu.edu.tr', 'admin123#', 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `announcement`
--

CREATE TABLE `announcement` (
  `id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `text` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `announcement`
--

INSERT INTO `announcement` (`id`, `club_id`, `date`, `text`) VALUES
(3, 17, '2025-06-08', '<p><strong>Sunday Yoga Session with Amir &amp; Dr. Hasan Ergüler</strong></p><p> 🧘‍♂️ <strong>1st June | 16:00 – 19:30</strong></p><p> 📍 <em>Iskele, Long Beach</em></p>'),
(4, 17, '2025-06-08', '<p><strong>Date*: </strong>Friday, May 23rd</p><p><strong>Location:</strong> Hilltown Beach Club, Esentepe</p><p><strong>Departure:</strong> Bus leaves from EMU Activity Center at 5:15 PM <strong>(please arrive by 5:00 PM)</strong></p><p><strong>Return:</strong> Approximately <strong>10:00 PM</stron'),
(5, 17, '2025-06-09', '<p><strong>fgjfjgiofji</strong></p><ol><li><strong> </strong>doiifhduig</li><li>eijre</li><li>dfjfdi</li></ol>');

-- --------------------------------------------------------

--
-- Structure de la table `candidate`
--

CREATE TABLE `candidate` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `bio` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `amount_of_votes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `candidate`
--

INSERT INTO `candidate` (`id`, `student_id`, `club_id`, `bio`, `photo`, `amount_of_votes`) VALUES
(10, 4, 17, 'Passionate about technology and leadership.', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749419283/profile_picture/pqndjbwr94dhwokm50gj.jpg', 4),
(11, 5, 17, 'Committed to making positive change.', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749419477/profile_picture/ahmjwcpb9ychmzq69vdu.jpg', 2),
(12, 105, 22, 'Creative thinker and team player.', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749307506/profile_picture/atio3lfc4ckm9pqhkrjp.jpg', 8),
(13, 106, 16, 'Experienced in organizing student events.', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749239208/profile_picture/tpldx7p6zwmepeexkrob.jpg', 5),
(14, 107, 17, 'Always ready to represent your voice.', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749414562/profile_picture/lfzhjfvv7qvydeautmnt.jpg', 9);

-- --------------------------------------------------------

--
-- Structure de la table `channels`
--

CREATE TABLE `channels` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `club_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `channels`
--

INSERT INTO `channels` (`id`, `name`, `category`, `club_id`) VALUES
(1, 'rules', 'welcome', 17),
(2, 'faq', 'welcome', 17),
(3, 'announcements', 'general', 17),
(4, 'general-chat', 'general', 17),
(5, 'club-media', 'general', 17),
(6, 'rules', 'welcome', 15),
(7, 'faq', 'welcome', 15),
(8, 'announcements', 'general', 15),
(9, 'general-chat', 'general', 15),
(10, 'club-media', 'general', 15),
(11, 'rules', 'welcome', 16),
(12, 'faq', 'welcome', 16),
(13, 'announcements', 'general', 16),
(14, 'general-chat', 'general', 16),
(15, 'club-media', 'general', 16),
(21, 'rules', 'welcome', 18),
(22, 'faq', 'welcome', 18),
(23, 'announcements', 'general', 18),
(24, 'general-chat', 'general', 18),
(25, 'club-media', 'general', 18),
(26, 'rules', 'welcome', 19),
(27, 'faq', 'welcome', 19),
(28, 'announcements', 'general', 19),
(29, 'general-chat', 'general', 19),
(30, 'club-media', 'general', 19),
(31, 'rules', 'welcome', 20),
(32, 'faq', 'welcome', 20),
(33, 'announcements', 'general', 20),
(34, 'general-chat', 'general', 20),
(35, 'club-media', 'general', 20),
(36, 'rules', 'welcome', 21),
(37, 'faq', 'welcome', 21),
(38, 'announcements', 'general', 21),
(39, 'general-chat', 'general', 21),
(40, 'club-media', 'general', 21),
(41, 'rules', 'welcome', 22),
(42, 'faq', 'welcome', 22),
(43, 'announcements', 'general', 22),
(44, 'general-chat', 'general', 22),
(45, 'club-media', 'general', 22),
(46, 'rules', 'welcome', 23),
(47, 'faq', 'welcome', 23),
(48, 'announcements', 'general', 23),
(49, 'general-chat', 'general', 23),
(50, 'club-media', 'general', 23),
(51, 'rules', 'welcome', 24),
(52, 'faq', 'welcome', 24),
(53, 'announcements', 'general', 24),
(54, 'general-chat', 'general', 24),
(55, 'club-media', 'general', 24),
(56, 'rules', 'welcome', 25),
(57, 'faq', 'welcome', 25),
(58, 'announcements', 'general', 25),
(59, 'general-chat', 'general', 25),
(60, 'club-media', 'general', 25),
(61, 'rules', 'welcome', 30),
(62, 'faq', 'welcome', 30),
(63, 'announcements', 'general', 30),
(64, 'general-chat', 'general', 30),
(65, 'club-media', 'general', 30),
(66, 'rules', 'welcome', 31),
(67, 'faq', 'welcome', 31),
(68, 'announcements', 'general', 31),
(69, 'general-chat', 'general', 31),
(70, 'club-media', 'general', 31),
(71, 'rules', 'welcome', 32),
(72, 'faq', 'welcome', 32),
(73, 'announcements', 'general', 32),
(74, 'general-chat', 'general', 32),
(75, 'club-media', 'general', 32),
(76, 'rules', 'welcome', 33),
(77, 'faq', 'welcome', 33),
(78, 'announcements', 'general', 33),
(79, 'general-chat', 'general', 33),
(80, 'club-media', 'general', 33),
(81, 'rules', 'welcome', 34),
(82, 'faq', 'welcome', 34),
(83, 'announcements', 'general', 34),
(84, 'general-chat', 'general', 34),
(85, 'club-media', 'general', 34),
(86, 'rules', 'welcome', 35),
(87, 'faq', 'welcome', 35),
(88, 'announcements', 'general', 35),
(89, 'general-chat', 'general', 35),
(90, 'club-media', 'general', 35),
(91, 'rules', 'welcome', 36),
(92, 'faq', 'welcome', 36),
(93, 'announcements', 'general', 36),
(94, 'general-chat', 'general', 36),
(95, 'club-media', 'general', 36),
(96, 'rules', 'welcome', 37),
(97, 'faq', 'welcome', 37),
(98, 'announcements', 'general', 37),
(99, 'general-chat', 'general', 37),
(100, 'club-media', 'general', 37),
(101, 'rules', 'welcome', 38),
(102, 'faq', 'welcome', 38),
(103, 'announcements', 'general', 38),
(104, 'general-chat', 'general', 38),
(105, 'club-media', 'general', 38),
(106, 'rules', 'welcome', 39),
(107, 'faq', 'welcome', 39),
(108, 'announcements', 'general', 39),
(109, 'general-chat', 'general', 39),
(110, 'club-media', 'general', 39),
(111, 'rules', 'welcome', 40),
(112, 'faq', 'welcome', 40),
(113, 'announcements', 'general', 40),
(114, 'general-chat', 'general', 40),
(115, 'club-media', 'general', 40),
(116, 'rules', 'welcome', 41),
(117, 'faq', 'welcome', 41),
(118, 'announcements', 'general', 41),
(119, 'general-chat', 'general', 41),
(120, 'club-media', 'general', 41),
(121, 'rules', 'welcome', 42),
(122, 'faq', 'welcome', 42),
(123, 'announcements', 'general', 42),
(124, 'general-chat', 'general', 42),
(125, 'club-media', 'general', 42),
(126, 'rules', 'welcome', 43),
(127, 'faq', 'welcome', 43),
(128, 'announcements', 'general', 43),
(129, 'general-chat', 'general', 43),
(130, 'club-media', 'general', 43),
(131, 'rules', 'welcome', 44),
(132, 'faq', 'welcome', 44),
(133, 'announcements', 'general', 44),
(134, 'general-chat', 'general', 44),
(135, 'club-media', 'general', 44),
(136, 'rules', 'welcome', 45),
(137, 'faq', 'welcome', 45),
(138, 'announcements', 'general', 45),
(139, 'general-chat', 'general', 45),
(140, 'club-media', 'general', 45),
(141, 'rules', 'welcome', 46),
(142, 'faq', 'welcome', 46),
(143, 'announcements', 'general', 46),
(144, 'general-chat', 'general', 46),
(145, 'club-media', 'general', 46),
(146, 'rules', 'welcome', 47),
(147, 'faq', 'welcome', 47),
(148, 'announcements', 'general', 47),
(149, 'general-chat', 'general', 47),
(150, 'club-media', 'general', 47),
(151, 'rules', 'welcome', 48),
(152, 'faq', 'welcome', 48),
(153, 'announcements', 'general', 48),
(154, 'general-chat', 'general', 48),
(155, 'club-media', 'general', 48);

-- --------------------------------------------------------

--
-- Structure de la table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `audio` varchar(300) DEFAULT NULL,
  `image` varchar(300) DEFAULT NULL,
  `type` varchar(300) DEFAULT NULL,
  `channel` varchar(255) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `chats`
--

INSERT INTO `chats` (`id`, `club_id`, `user_id`, `message`, `audio`, `image`, `type`, `channel`, `time`) VALUES
(1, 17, 5, 'hi', NULL, NULL, NULL, 'general-chat', '2025-06-10 19:59:19'),
(2, 17, 5, 'i ** gere', NULL, NULL, NULL, 'general-chat', '2025-06-10 19:59:22'),
(3, 17, 5, 'i ** here', NULL, NULL, NULL, 'general-chat', '2025-06-10 19:59:26'),
(4, 17, 5, 'look at me 😁', NULL, NULL, NULL, 'general-chat', '2025-06-10 19:59:30'),
(5, 17, 5, '**', NULL, NULL, NULL, 'general-chat', '2025-06-10 19:59:34'),
(6, 17, 5, 'is', NULL, NULL, NULL, 'general-chat', '2025-06-10 19:59:44'),
(7, 17, 3, 'Rules and regulation of Yoga club', NULL, NULL, NULL, 'rules', '2025-06-09 15:39:24'),
(8, 17, 3, 'test', NULL, NULL, NULL, 'faq', '2025-06-09 15:41:26'),
(9, 17, 3, 'hi', NULL, NULL, 'text', 'general-chat', '2025-06-10 20:43:04'),
(10, 17, 3, 'audio message', 'https://res.cloudinary.com/dl7wibkyz/raw/upload/v1749597705/audio_uploads/yklqwn3jddws1ephiuib.webm', NULL, 'audio', 'general-chat', '2025-06-10 23:21:46'),
(11, 17, 3, 'audio message', 'https://res.cloudinary.com/dl7wibkyz/raw/upload/v1749599713/audio_uploads/hzqzao7fip7gjxornhdv.webm', NULL, 'audio', 'general-chat', '2025-06-10 23:55:13'),
(12, 17, 3, 'audio message', 'https://res.cloudinary.com/dl7wibkyz/raw/upload/v1749599771/audio_uploads/mgbyfksouii57nsgejwy.webm', NULL, 'audio', 'general-chat', '2025-06-10 23:56:12'),
(13, 17, 3, 'audio message', 'https://res.cloudinary.com/dl7wibkyz/raw/upload/v1749621031/audio_uploads/mawjhfz4thduqmhfqetq.webm', NULL, 'audio', 'general-chat', '2025-06-11 05:50:33'),
(14, 17, 3, 'media', NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749621184/files/mjb9wadfqj25me1ekhep.jpg', 'media', 'club-media', '2025-06-11 05:53:06'),
(15, 17, 3, 'audio message', 'https://res.cloudinary.com/dl7wibkyz/raw/upload/v1749628784/audio_uploads/ybkqfeo7fmimqgrpkzdv.webm', NULL, 'audio', 'general-chat', '2025-06-11 07:59:45'),
(16, 17, 3, 'media', NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749628802/files/kntwrtk7adhqf8biekg1.jpg', 'media', 'club-media', '2025-06-11 08:00:03'),
(17, 17, 5, 'hi', NULL, NULL, 'text', 'general-chat', '2025-06-18 20:15:25'),
(18, 17, 3, '😄', NULL, NULL, 'text', 'general-chat', '2025-06-18 20:24:06');

-- --------------------------------------------------------

--
-- Structure de la table `club`
--

CREATE TABLE `club` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `club`
--

INSERT INTO `club` (`id`, `name`, `logo`, `description`, `is_active`) VALUES
(15, 'Unicorn', 'unicorn.jpg', 'we are the unicorn club', 1),
(16, 'Industrial Engineering Club', 'images.png', 'This club has been Deactivated', 1),
(17, 'Yoga Club', '1743187263841-yoga.png', 'we are the yoga', 1),
(18, 'IT Club', '1743187568906-it_club.jpg', 'The EMU IT Club is an active community for students passionate about technology and innovation. The club organizes workshops, hackathons, and seminars on various topics, including programming, cybersecurity, artificial intelligence, web and mobile app development, data science, cloud computing, and blockchain technology. It aims to enhance technical skills, foster collaboration, and provide opportunities for students to learn, network, and grow in the fast-evolving IT field.', 1),
(19, 'AIESEC Eastern Mediterranean', '1743187691481-AIESEC-Logo.png', 'AIESEC, which is present in more than 1,600 universities in +120 countries in the world, is an international platform where young people can discover and develop their own potential in order to have a positive impact on society. To this end, AIESEC organizes more than 470 conferences per year, provides its members with 10,000 international experiences and offers over 10,000 leadership experiences. AIESEC, which has been operating worldwide since 1948 and in the TRNC Eastern Mediterranean University since 1992, is the “World’s Largest Student and Exchange Organization” that is non-political, non-profit, innovative, does not discriminate based on religion, language or race and is managed entirely by volunteer university students. It also serves as a youth consultant to UNESCO, UNICEF and the UNITED NATIONS as the representative of the world’s youth.', 1),
(20, 'Anime Club', '1743187857059-anime club.jpg', 'The club was founded in 2018 by a group of foreign students to promote anime culture. It organizes games, trips and social events to get together with its members throughout the year, especially anime movie nights.', 1),
(21, 'Astronomy and Space Sciences Club', '1743187931376-astronomy logo.jpg', 'Astronomy and Space Sciences Club brings together students who are interested in the sky and the universe. It offers opportunities to explore astronomy through telescope observation activities and scientific seminars.', 1),
(22, 'Atatürk Ideology Club', '1743188018641-ataturk ideology logo.jpg', 'The club operates within the framework of \'Ataturk Ideology\'. Its aim is to spread Ataturk\'s Principles and Revolutions and to create a university youth that is in line with that ideology. It leads students on national days and organizes commemoration ceremonies, national marches, exhibitions and conferences.', 1),
(23, 'Flag Football Club', '1743188202305-footbal logo.png', 'Flag Football, which has become rapidly popular in recent years, was founded by a group of female students at our university in 2018. Unlike sports such as volleyball, basketball and football, this sport is played without equipment, and the flags are used attached to the belts and it takes its name from these flags. Our team, Lady Crows, which has the distinction of being the first flag football team in TRNC, represents our university by participating in the Pro League and Uni Leagues.', 1),
(24, 'Dance Club', '1743188265761-dance clu.jpg', 'The Dance Group, which has been active for many years, brings together all EMU students who are devoted to dance and works in various dance genres. Accompanied by an instructor, it works in Latin and hip-hop, especially Bachata. It brings together those who want to learn to dance and have a pleasant time in a fun environment.', 1),
(25, 'DENT Club', '1743188324832-dent club.jpg', 'Founded in 2024 by a group of dentistry students, EMU Dent Club is a community that includes not only dentistry students but also all university students. The club organizes various academic and social activities to enhance professional knowledge and skills, contribute to public health with a sense of social responsibility, and represent our faculty on national and international platforms.', 1),
(30, 'Nutrition and Dietetics Club', 'nutrition_diabitiesclub_logo.png', 'The Nutrition and Dietetics Club was founded in 2024 by a group of Nutrition and Dietetics students. The club aims to promote healthy nutrition based on nutritional principles. For this purpose, it organizes events to introduce, teach and encourage topics such as healthy plate preparation, healthy cooking techniques and the nutrients and nutrients necessary for health.', 1),
(31, 'Environment and National Sciences Club', '1749397000970-environment_natural_science_clublogo.jpg', 'It was established to increase awareness and raise awareness about nature protection. Our club opens its doors to everyone who wants to discover the richness of Cyprus\' nature. It offers its members an active participation opportunity with workshops, field trips/studies and online events. It aims to create a scientific interaction environment on our campus through these studies.', 1),
(32, 'Children’s Rights Club', '1749397513021-Children’s_Rights_Club_logo.jpg', 'Children\'s Rights Club defends children\'s rights and organizes events to raise awareness. It aims to increase social responsibility awareness through panels, conferences, seminars and workshops with expert speakers in the field.', 1),
(33, 'Mountaineering and Nature Sport Club', '1749397588642-Mountaineering_and_Nature_Sports_Club.jpg', 'Mountaineering and Nature Sports Club brings together the love of nature and the passion for adventure, and offers various activities to students who want to spend time in nature. Activities organized with instructors include nature walks (hiking), rock climbing, camping and social events. The aim of the club is to provide its members with the opportunity to explore nature, and to strengthen team spirit and solidarity. The club, which offers the opportunity to discover the natural beauties of Cyprus, supports participants of all levels.', 1),
(34, 'EMU Search and Rescue Club', '1749397655776-EMU_Search_and_Rescue_Club_lgo.jpg', 'EMU Search and Rescue Club started its activities in 2000. Its aim is to train EMU students to intervene correctly and consciously in first aid matters that need to be applied in case of any natural disaster or accident and to minimize the possible loss of life and property. EMU-KUT is a community consisting entirely of EMU students. They work very hard and are very disciplined. EMU-KUT participates in training camps and exercises organized regularly by the Civil Defense Organization of TRNC. The club also participates in international university search and rescue games organized every year.', 1),
(35, 'EMU Scientific Research Community', '1749397712174-EMU_Scientific_Research_Community_logo.jpg', 'It is a student community centered at EMU Faculty of Medicine and includes members from different faculties. It aims to keep the interest in scientific research alive and to this end, it organizes conferences, seminars and events to convey information to a wide audience. The community supports the academic and social development of students with the activities it carries out throughout the year. It also offers its members the opportunity for interdisciplinary collaboration and communication.', 1),
(36, 'Fantastic Role Play Club', '1749397906811-Fantastic_Role_Play_Club_logo.jpg', 'Fantastic Role Play Club (EMU RPG) is a community that brings together students who are interested in tabletop role-playing games and board games. The club organizes events such as creating creative stories, character development and strategy implementation using Dungeons & Dragons, Fate and other popular role-playing systems. In addition, students are provided with the opportunity to get to know these game types better through organized board game nights, workshops and trainings. The main purpose of EMU RPG Club is to support students to socialize, develop cooperation skills and enrich their imagination in a fun and creative environment.', 1),
(37, 'Idea and Debate Club', '1749397979791-Idea_and_Debate_Club_logo.jpg', 'The Idea and Debate Club consists of various sub-units that encourage free thought and bring together different perspectives. The club organizes various events to ensure that its members develop both intellectually and socially. With these events, it supports creative thinking, develops critical thinking skills and strengthens communication between members. It also contributes to the intellectual development of its members by conducting in-depth analyses of literary works. It strengthens and develops its members both individually and as a community by offering them a wide range of ideas.', 1),
(38, 'Photography Club', '1749398015730-Photography_Club_logo.jpg', 'It is a club that brings together students who want to love the art of photography and improve themselves in this field. The club operates to teach its members photography techniques, support artistic perspectives and establish warm and sincere relationships between students from different cultures through photography. It provides its members with the opportunity to discover the historical and natural beauties of Cyprus and to photograph these moments through organized educational trips. It also organizes at least one exhibition each term, allowing students to exhibit their works. It aims to strengthen social ties by encouraging creative sharing while developing technical skills of members through workshops and events.', 1),
(39, 'Swimming Club', '1749398171370-Swimming_Club_logo.jpg', 'The Swimming Club was founded in 1995. Since its foundation, it has been providing the opportunity for experienced and licensed swimmers who are devoted to swimming to train in an Olympic-sized pool on a regular basis. In addition to sea swimming competitions, the club also represents the university in the Inter-University Swimming Competitions held every year.', 1),
(40, 'Software and AI Development Club', '1749398203398-Software_and_AI_Development_Club_logo.jpg', 'EMU Software and Artificial Intelligence Development Club, as the largest and most active community in the field of Software and Artificial Intelligence of Eastern Mediterranean University and the island, provides students with the opportunity to develop their technical and professional skills. While the club develops innovative projects and participates in national and international competitions, it also organizes webinars, seminars and trainings with important names from the world\'s leading companies so that students can get to know the sector closely. In addition, members have the opportunity to develop their practical skills and produce creative solutions through organized hackathons, coding marathons and technical workshops. The largest artificial intelligence event in the region, AI Summit, organized every year, brings together important professionals from the sector and offers students unique experiences, networking opportunities and internship opportunities.', 1),
(41, 'International Relations Club', '1749398370717-International_Relations_Club_logo.png', 'International Relations (PUGWASH) Club is a platform that organizes certified panels with experts on international politics. It offers global politics discussions and simulation activities among members where they can put their theoretical knowledge into practice, and also organizes cultural events to ensure integration.', 1),
(42, 'Tourism Club', '1749398607377-Tourism_Club.jpg', 'The Tourism Club brings students together through cultural exploration and shared learning experiences. It creates a strong sense of community among its members by celebrating both local and global traditions. The club is a platform where connections are made and different cultures come to life, thus enriching the university experience of the participants.', 1),
(43, 'EMU Theatre Community', '1749398659930-EMU_Theatre_Community_logo.jpg', 'EMU Theatre Community is the meeting point for students who want to improve themselves and showcase their talents in performing arts. The community makes the power of art felt on campus with plays it performs every year. The group aims to help students express themselves, socialize and develop their talents through drama and theatre. It contributes to the personal and artistic development of its members by providing training in subjects such as acting, effective speaking and public speaking skills with professional instructors.', 1),
(44, 'Chess Club', '1749398693358-Chess_Club_logo.jpg', 'The club aims to provide students with the opportunity to come together in a social environment outside of class, have fun and interact with each other through the events it organizes. At the same time, it supports students who want to start playing chess and develop in this field, and encourages them to compete in professional tournaments. The club aims to spread the love of chess and discover talented players, and aims to bring chess enthusiasts together and bring this strategic game to a wider audience.', 1),
(45, 'Design Club', '1749398778748-DesignClub_logo.png', 'It was founded by a group of students from the Faculty of Architecture. With the help of many social, artistic and academic events, it is aimed to prepare students for life and careers in a more equipped way and to grow up as individuals who can look at the world from a broader perspective. Within the scope of the ‘International Design Week’, traditionally organized in cooperation with the Faculty of Architecture and the club, club members and all students who are devoted to design have the opportunity to meet and work with many renowned designers from abroad and within the country in workshops covering different and wide areas of interest.', 1),
(46, 'Music Club', '1749398844743-Music_Club_logo.jpg', 'The Music Club is a community that aims to bring together individuals interested in music to both learn and have a good time. Club activities include group work, jam sessions, concert organizations and music theory workshops. Bringing together music lovers of all levels, from beginners to professionals, the Music Club is open to everyone who wants to feel the unifying power of music.', 1),
(47, 'Animal Welfare Club', '1749398900086-Animal_Welfare_Club_logo.jpg', 'The Animal Welfare Club started its activities as a “Volunteer Movement” with the initiative of a group of animal-loving academic staff and students. The club voluntarily provides for the feeding and care of dogs living in the EMU Animal Shelter, and directs our furry friends in need of treatment to the veterinarian. It aims to develop the human-animal relationship in the best way possible, to instill love for animals and awareness of stray animals in the entire society, especially in EMU students. With the EMU NVL Project (Neuter, Vaccine, Let Live Project) initiated in 2011 with the support of the EMU Rectorate, approximately 700 dogs have been neutered and tagged to date. The main volunteers of this project are the Animal Welfare Club members.', 1),
(48, 'Genetics Club', '1749398933912-Genetics_Club_logo.jpg', 'The Genetics Club is an innovative and entrepreneurial club that aims to train molecular biologists who are equipped with knowledge and skills in this field of science, have ethical values, are creative, enterprising, project-oriented and prone to multidisciplinary studies, and have national and international competencies. Events organized throughout the year provide new information in the field of genetics.', 1),
(49, 'Physics', '1750278409381-childrenclub.png', 'my club', 1),
(50, 'Children\'s Rights Club', 'mah.jpg', 'new club new energy', 1);

-- --------------------------------------------------------

--
-- Structure de la table `club_requests`
--

CREATE TABLE `club_requests` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `club_requests`
--

INSERT INTO `club_requests` (`id`, `name`, `description`, `logo`, `status`, `created_at`, `student_id`) VALUES
(7, 'new', 'this is club', 'avatar-6.jpg', 'approved', '2025-06-11 07:47:39', 124),
(8, 'video games', 'this is my club', 'mah.jpg', 'rejected', '2025-06-16 13:09:33', 125),
(10, 'Music Club', 'jihuizhduih', 'genetic.png', 'pending', '2025-06-18 20:48:01', 127);

-- --------------------------------------------------------

--
-- Structure de la table `election_status`
--

CREATE TABLE `election_status` (
  `id` int(11) NOT NULL,
  `start` tinyint(1) NOT NULL DEFAULT 0,
  `stop` tinyint(1) NOT NULL DEFAULT 0,
  `publish` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `election_status`
--

INSERT INTO `election_status` (`id`, `start`, `stop`, `publish`) VALUES
(1, 1, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `event1`
--

CREATE TABLE `event1` (
  `id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `date_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_selected` date NOT NULL,
  `approval` tinyint(1) DEFAULT 0,
  `is_postfeedback` tinyint(1) NOT NULL,
  `zoom_link` varchar(300) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `feedback` varchar(400) DEFAULT NULL,
  `event_time` time DEFAULT NULL,
  `is_announced` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `event1`
--

INSERT INTO `event1` (`id`, `club_id`, `date_name`, `description`, `date_selected`, `approval`, `is_postfeedback`, `zoom_link`, `image`, `feedback`, `event_time`, `is_announced`) VALUES
(5, 15, 'Unicorn party', 'so cool party', '2025-04-03', 1, 0, NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1743439425/events_images/qyszrprkfazq33xz1bnd.jpg', NULL, NULL, 0),
(6, 15, 'Unicorn fan club', 'So much fuun', '2025-05-09', 1, 1, 'https://app.zoom.us/wc', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1743510830/events_images/mdvm02fj9hdblyfsa6ue.jpg', NULL, NULL, 0),
(8, 17, 'yoga session', 'near by the sea', '2025-03-25', 1, 1, NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1744200645/events_images/gfmpkarms6ljyuglmpug.jpg', NULL, '17:08:00', 1),
(10, 17, 'Navruz celebration', 'We will be happy to see everyone!', '2025-03-20', -1, 1, NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1743602569/events_images/yqcrorfsit5axyc4bkp7.jpg', 'not good', NULL, 0),
(11, 17, 'Sunday yoga and mindfulness', 'Unwind and recharge with our Sunday Yoga and Mindfulness session — a peaceful start to your week. This gentle class combines light yoga stretches with guided mindfulness meditation to help you relax, reduce stress, and improve your focus. Whether you\'re a beginner or experienced, all are welcome to join this calming journey for the body and mind.', '2025-06-26', 1, 1, NULL, NULL, NULL, '07:45:00', 1),
(12, 17, 'Sunday Yoga Session', 'Take a break from your busy schedule and join us for a refreshing Sunday Yoga Session by the beach! This special event is designed to rejuvenate your body and mind through:\r\n\r\n✔️ Yoga Session\r\n✔️ Beach Volleyball\r\n✔️ Breath Work\r\n✔️ Yoga Philosophy\r\n✔️ Mindfulness Activities\r\n\r\nOpen to all levels — from beginners to seasoned yogis — this session offers the perfect blend of movement, connection, and serenity. Don’t miss this opportunity to reset, reconnect, and relax in the beautiful surroundings of Long Beach.', '2025-06-15', 1, 0, NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749423120/events_images/bide8masmt4svmxpwtti.jpg', NULL, '16:00:00', 1),
(13, 17, 'Yoga & Handpan journey', 'Remember that yoga session we told you about in Girne? Well, it’s finally around the corner — and we can’t wait to share it with you!\r\nJoin us for a magical Sunset Yoga & Handpan Journey at the stunning Hill Town Beach Club — all for just 175TL!\r\nAnd yes, that price includes transport to and from the venue! \r\n\r\nWe’ve got a special experience planned for you: calming yoga, soulful handpan music, and a serene beachside vibe you won’t forget. 🌅', '2025-06-23', 1, 1, NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749423438/events_images/ar9tfpgv5aosdn1z8snd.jpg', NULL, '05:15:00', 1),
(14, 17, 'party', 'yesssss', '2025-06-19', 0, 0, NULL, NULL, NULL, '12:58:00', 0),
(15, 42, 'party', 'with me', '2025-06-19', 0, 1, NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1750084269/events_images/jcnc3pvndilsscyophax.png', NULL, '19:30:00', 0),
(16, 17, 'party', 'eid\r\n', '2025-06-18', -1, 1, NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1750278152/events_images/txxyt6fdnnul9irsf4zg.jpg', 'there is other event', '21:25:00', 0),
(17, 17, 'party', 'chrismas', '2025-06-19', 1, 1, NULL, 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1750278152/events_images/p7zqnavd1jasrlzzg6iz.jpg', NULL, '21:25:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `faq`
--

CREATE TABLE `faq` (
  `id` int(11) NOT NULL,
  `question` varchar(100) NOT NULL,
  `answer` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `faq`
--

INSERT INTO `faq` (`id`, `question`, `answer`) VALUES
(15, 'How can I reset my password?', 'Click \"Forgot Password\" on the login page and follow the instructions.'),
(16, 'How do I join a club?', 'Go to the Clubs page, select a club, and click \"Join\".'),
(18, 'How can i create my own club?', 'On your dashboard there is a section \"Club Request\" wheere you can fil out the form.'),
(19, 'why', ''),
(20, 'clubbb', '');

-- --------------------------------------------------------

--
-- Structure de la table `help_tutorial`
--

CREATE TABLE `help_tutorial` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` varchar(300) NOT NULL,
  `file` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `help_tutorial`
--

INSERT INTO `help_tutorial` (`id`, `title`, `description`, `file`) VALUES
(1, 'Myvideo tut', 'helpful video', 'https://res.cloudinary.com/dl7wibkyz/video/upload/v1749218499/videos_tutorial/gok71aonhcyoicf7eezc.mkv');

-- --------------------------------------------------------

--
-- Structure de la table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `date_joined` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `members`
--

INSERT INTO `members` (`id`, `student_id`, `club_id`, `date_joined`) VALUES
(3, 4, 17, '2025-04-25'),
(4, 5, 17, '2025-03-14'),
(8, 4, 15, '2025-05-21'),
(15, 105, 22, '2025-06-08'),
(16, 105, 32, '2025-06-08'),
(17, 105, 15, '2025-06-08'),
(18, 106, 35, '2025-06-08'),
(19, 106, 16, '2025-06-08'),
(20, 106, 39, '2025-06-08'),
(21, 107, 44, '2025-06-08'),
(22, 107, 21, '2025-06-08'),
(23, 107, 17, '2025-06-08'),
(24, 108, 15, '2025-06-09'),
(25, 108, 48, '2025-06-09'),
(26, 108, 36, '2025-06-09'),
(27, 109, 20, '2025-06-09'),
(28, 109, 32, '2025-06-09'),
(29, 109, 33, '2025-06-09'),
(31, 110, 30, '2025-06-09'),
(32, 110, 21, '2025-06-09'),
(33, 110, 39, '2025-06-09'),
(34, 111, 17, '2025-06-09'),
(35, 111, 35, '2025-06-09'),
(36, 111, 20, '2025-06-09'),
(37, 112, 19, '2025-06-09'),
(38, 112, 47, '2025-06-09'),
(39, 112, 21, '2025-06-09'),
(40, 113, 24, '2025-06-09'),
(41, 113, 25, '2025-06-09'),
(42, 113, 45, '2025-06-09'),
(43, 114, 34, '2025-06-09'),
(44, 114, 41, '2025-06-09'),
(45, 114, 33, '2025-06-09'),
(46, 115, 46, '2025-06-09'),
(47, 115, 23, '2025-06-09'),
(48, 115, 38, '2025-06-09'),
(49, 116, 40, '2025-06-09'),
(50, 116, 42, '2025-06-09'),
(51, 116, 17, '2025-06-09'),
(52, 117, 47, '2025-06-09'),
(53, 117, 21, '2025-06-09'),
(54, 117, 43, '2025-06-09'),
(55, 118, 44, '2025-06-09'),
(56, 118, 37, '2025-06-09'),
(57, 118, 38, '2025-06-09'),
(58, 119, 17, '2025-06-09'),
(59, 119, 24, '2025-06-09'),
(60, 119, 35, '2025-06-09'),
(61, 120, 47, '2025-06-09'),
(62, 120, 17, '2025-06-09'),
(63, 120, 40, '2025-06-09'),
(64, 121, 17, '2025-06-09'),
(65, 121, 43, '2025-06-09'),
(66, 121, 36, '2025-06-09'),
(67, 122, 17, '2025-06-09'),
(68, 122, 19, '2025-06-09'),
(69, 122, 32, '2025-06-09'),
(70, 66, 17, '2025-06-11'),
(71, 124, 17, '2025-06-11'),
(72, 124, 22, '2025-06-11'),
(74, 125, 42, '2025-06-16'),
(75, 126, 17, '2025-06-18'),
(77, 127, 21, '2025-06-18');

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(11) NOT NULL,
  `message` varchar(300) NOT NULL,
  `type` varchar(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `is_read` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notification`
--

INSERT INTO `notification` (`id`, `club_id`, `title`, `message`, `type`, `created_at`, `user_id`, `channel_id`, `message_id`, `is_read`) VALUES
(1, 17, 'party ', '<p>stay tuned</p>', 'announcemen', '2025-06-18 17:23:15', 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `president`
--

CREATE TABLE `president` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `date_selected` date NOT NULL,
  `bio` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `president`
--

INSERT INTO `president` (`id`, `student_id`, `club_id`, `date_selected`, `bio`) VALUES
(5, 3, 17, '2025-04-01', 'It is mee and i like to be president!!!'),
(6, 75, 15, '2025-06-05', 'Selin Özdemir, Physics student and President at EMU, known for her leadership, dedication to science, and commitment to fostering a collaborative and inspiring environment for all physics enthusiasts.'),
(7, 56, 16, '2024-06-12', 'Ahmet Yilmaz, a passionate Computer Science student at EMU, eager to expand his coding skills and explore innovative tech solutions, currently a non-member but always ready to contribute and learn.'),
(8, 68, 18, '2025-02-01', 'I love IT!'),
(9, 60, 19, '2025-04-15', 'Burak Çelik, an Economics student at EMU with a keen interest in market trends and financial analysis, currently a non-member, motivated to gain practical experience and broaden his understanding of t'),
(10, 58, 20, '2024-09-02', 'Mert Öztürk, a passionate Mathematics student at EMU who enjoys problem-solving and exploring abstract concepts, currently a non-member, eager to connect with like-minded peers and expand his knowledg'),
(11, 7, 21, '2025-06-16', 'My bio'),
(12, 61, 22, '2025-04-28', 'Aylin Şahin, president and Communication and Media Studies student at EMU, passionate about storytelling, media innovation, and leading initiatives that connect people and ideas across campus.'),
(13, 73, 23, '2025-01-13', 'Gül Yalçın, Law student at EMU, dedicated to justice and legal studies, eager to develop strong advocacy skills and make a positive impact in the community.'),
(14, 71, 24, '2025-03-25', 'Fatma Çetin, Pharmacy student and club president at EMU, passionate about advancing healthcare and committed to promoting wellness through leadership and innovation.'),
(15, 72, 25, '2025-01-17', 'President of the Dent Club and Pharmacy student at EMU, dedicated to fostering collaboration and innovation among future healthcare professionals.'),
(16, 59, 30, '2025-01-11', 'passionate about promoting healthy lifestyles and nutritional awareness on campus.\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n'),
(17, 57, 31, '2023-05-29', 'Elif Demir, president of the Environment and National Sciences Clubs and Architecture student at EMU, dedicated to sustainable design and environmental awareness.'),
(18, 63, 32, '2025-05-12', 'Seda Yılmaz, president of the Children’s Rights Club and a Physics student at EMU, passionate about using science and advocacy to create a brighter, fairer future for every child.'),
(19, 62, 33, '2025-04-25', ''),
(20, 55, 34, '2025-03-03', 'As president of EMU Search and Rescue Club, I’m dedicated to building a strong, prepared community—ready to respommmnd, ready to helpppp, and always ready to make a difference.'),
(21, 65, 35, '2025-03-30', 'Leading the EMU Scientific Research Community with curiosity and commitment—driven to spark innovation, support young researchers, and turn ideas into impact.'),
(22, 67, 36, '2025-03-16', 'Championing imagination at EMU, I lead the Fantastic Role Play Club where storytelling, creativity, and epic adventures bring students together like never before.'),
(23, 70, 37, '2025-03-24', 'Fueling minds and sparking conversations, I lead the Idea and Debate Club at EMU—a space where diverse opinions meet respectful dialogue, and every idea gets its moment to shine.'),
(24, 64, 38, '2025-03-17', 'Through the lens, I capture more than just moments—I tell stories. As the president of the EMU Photography Club, I strive to create a vibrant community for visual storytellers to learn, share, and exp'),
(25, 69, 39, '2025-03-29', 'As president of the EMU Swimming Club, I’m dedicated to building a community where students dive into both fitness and friendship. '),
(26, 74, 40, '2025-03-19', 'As president of the Software and AI Development Club, I lead a passionate team of tech enthusiasts eager to code, create, and innovate. Our club is a hub for students interested in programming, artifi'),
(27, 104, 41, '2025-04-03', 'As president of the International Relations Club, I am passionate about fostering global awareness and cultural exchange among students. I strive to create a welcoming environment where we can discuss'),
(28, 102, 42, '2025-02-27', 'As president of the Tourism Club, I am dedicated to promoting the beauty and diversity of travel experiences while educating members about the tourism industry. I focus on organizing activities that i'),
(29, 103, 43, '2023-09-02', 'As president of the EMU Theatre Community, I lead a passionate group of students who love the performing arts. I organize theatrical productions, workshops, and events that encourage creativity, colla'),
(30, 5, 50, '2025-06-18', '');

-- --------------------------------------------------------

--
-- Structure de la table `request`
--

CREATE TABLE `request` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `reg_num` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `status` varchar(20) NOT NULL,
  `anonymous` tinyint(1) NOT NULL,
  `club_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `request`
--

INSERT INTO `request` (`id`, `student_id`, `reg_num`, `type`, `text`, `status`, `anonymous`, `club_id`) VALUES
(1, 4, '', 'suggestion', 'Mybe next time we will take more fitness mats for new comers', 'reviewed', 0, 17),
(2, 4, '', 'complaint', 'Last time near by the sea was quite cold and long road to go there', 'Pending', 0, 17),
(3, 125, '', 'suggestion', 'clubs', 'Pending', 1, 42),
(4, 125, '', 'request', 'clube', 'Pending', 1, 42),
(5, 126, '', 'request', 'dnhrb', 'resolved', 1, 17),
(6, 5, '', 'request', 'my club', 'Pending', 1, 17);

-- --------------------------------------------------------

--
-- Structure de la table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `std_no` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_num` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'non-member',
  `dept` varchar(255) NOT NULL,
  `profile_picture` varchar(300) NOT NULL DEFAULT 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `student`
--

INSERT INTO `student` (`id`, `name`, `surname`, `std_no`, `email`, `phone_num`, `password`, `role`, `dept`, `profile_picture`) VALUES
(3, 'Amir', 'Ad', 22902275, '22902275@emu.edu.tr', '+90 533 872 45 69', 'hanna123#', 'president', 'Tourism', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749422257/profile_picture/dconwdrjunjx1jjsvfpk.jpg'),
(4, 'Vala', 'Valoska', 5633, '22902290@emu.edu.tr', '05337894562', 'vala123@', 'president', 'art and science', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749572877/profile_picture/o7imqoephe4gpuunn3rr.jpg'),
(5, 'Galya', 'Valentinovna', 22902280, '22902280@emu.edu.tr', '456789546799', 'galya123@@', 'member', 'medical', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749574486/profile_picture/ysgy3ldds1kj6v5smpem.jpg'),
(7, 'Halil', 'Bolayir', 22331279, '22331279@emu.edu.tr', '+905337618424', 'halil123@', 'president', 'Science', ''),
(55, 'Murat', 'Kutulov', 20123456, '20123456@emu.edu.tr', '+905321234567', 'pass123#', 'president', 'Economics', ''),
(56, 'Ahmet', 'Yilmaz', 21234567, '21234567@emu.edu.tr', '+905321987654', 'pass123#', 'president', 'Computer Science', ''),
(57, 'Elif', 'Demir', 23216789, '23216789@emu.edu.tr', '+905312345678', 'pass123#', 'president', 'Architecture', ''),
(58, 'Mert', 'Öztürk', 24345678, '24345678@emu.edu.tr', '+905311234569', 'pass123#', 'president', 'Mathematics', ''),
(59, 'Leyla', 'Kara', 25123490, '25123490@emu.edu.tr', '+905310987654', 'pass123#', 'president', 'Biology', ''),
(60, 'Burak', 'Çelik', 20239874, '20239874@emu.edu.tr', '+905398765432', 'pass123#', 'president', 'Economics', ''),
(61, 'Aylin', 'Şahin', 21123485, '21123485@emu.edu.tr', '+905387654321', 'pass123#', 'president', 'Communication and Media Studies', ''),
(62, 'Emre', 'Kılıç', 23456789, '23456789@emu.edu.tr', '+905376543210', 'pass123#', 'president', 'Computer Engineering', ''),
(63, 'Seda', 'Yılmaz', 24321987, '24321987@emu.edu.tr', '+905365432109', 'pass123#', 'president', 'Physics', ''),
(64, 'Kaan', 'Demirtaş', 25109876, '25109876@emu.edu.tr', '+905354321098', 'pass123#', 'president', 'Art & Sciences', ''),
(65, 'Merve', 'Aydın', 20234567, '20234567@emu.edu.tr', '+905343210987', 'pass123#', 'president', 'Biology', ''),
(66, 'Can', 'Yıldız', 21198765, '21198765@emu.edu.tr', '+905332109876', 'pass123#', 'member', 'Economics', ''),
(67, 'Zeynep', 'Polat', 23412345, '23412345@emu.edu.tr', '+905321098765', 'pass123#', 'president', 'Law', ''),
(68, 'Ali', 'Kara', 24365432, '24365432@emu.edu.tr', '+905310987654', 'pass123#', 'president', 'Information Technology', ''),
(69, 'Esra', 'Acar', 25156789, '25156789@emu.edu.tr', '+905309876543', 'pass123#', 'president', 'Physics', ''),
(70, 'Deniz', 'Şimşek', 20219876, '20219876@emu.edu.tr', '+905308765432', 'pass123#', 'president', 'Communicaton and Media Studies', ''),
(71, 'Fatma', 'Çetin', 21123498, '21123498@emu.edu.tr', '+905307654321', 'pass123#', 'president', 'Pharmacy', ''),
(72, 'Okan', 'Öz', 23345678, '23345678@emu.edu.tr', '+905306543210', 'pass123#', 'president', 'Dentistry', ''),
(73, 'Gül', 'Yalçın', 24210987, '24210987@emu.edu.tr', '+905305432109', 'pass123#', 'president', 'Law', ''),
(74, 'Barış', 'Kaya', 25134567, '25134567@emu.edu.tr', '+905304321098', 'pass123#', 'president', 'Computer Engineering', ''),
(75, 'Selin', 'Özdemir', 20298765, '20298765@emu.edu.tr', '+905303210987', 'pass123#', 'president', 'Physics', ''),
(76, 'Tuna', 'Karaca', 21234569, '21234569@emu.edu.tr', '+905302109876', 'pass123#', 'non-member', 'Mathematics', ''),
(77, 'Buse', 'Ateş', 23321987, '23321987@emu.edu.tr', '+905301098765', 'pass123#', 'non-member', 'Biology', ''),
(78, 'Furkan', 'Güneş', 24398765, '24398765@emu.edu.tr', '+905300987654', 'pass123#', 'non-member', 'Economics', ''),
(79, 'Derya', 'Demirtaş', 25187654, '25187654@emu.edu.tr', '+905299876543', 'pass123#', 'non-member', 'Law', ''),
(80, 'Ege', 'Şen', 20123489, '20123489@emu.edu.tr', '+905298765432', 'pass123#', 'non-member', 'Computer Science', ''),
(81, 'Nazlı', 'Karahan', 21198743, '21198743@emu.edu.tr', '+905297654321', 'pass123#', 'non-member', 'Physics', ''),
(82, 'Onur', 'Yılmaz', 23219874, '23219874@emu.edu.tr', '+905296543210', 'pass123#', 'non-member', 'Mathematics', ''),
(84, 'Kerem', 'Koç', 25123479, '25123479@emu.edu.tr', '+905294321098', 'pass123#', 'non-member', 'Economics', ''),
(86, 'Cem', 'Yücel', 21234587, '21234587@emu.edu.tr', '+905292109876', 'pass123#', 'non-member', 'Computer Engineering', ''),
(87, 'Selma', 'Arslan', 23345612, '23345612@emu.edu.tr', '+905291098765', 'pass123#', 'non-member', 'Physics', ''),
(88, 'Baran', 'Can', 24321954, '24321954@emu.edu.tr', '+905290987654', 'pass123#', 'non-member', 'Mathematics', ''),
(89, 'Dilan', 'Yıldırım', 25198743, '25198743@emu.edu.tr', '+905289876543', 'pass123#', 'non-member', 'Biology', ''),
(90, 'Emir', 'Uslu', 20234592, '20234592@emu.edu.tr', '+905288765432', 'pass123#', 'non-member', 'Economics', ''),
(91, 'Aslı', 'Polat', 21123467, '21123467@emu.edu.tr', '+905287654321', 'pass123#', 'non-member', 'Law', ''),
(93, 'Selin', 'Yıldız', 24345619, '24345619@emu.edu.tr', '+905285432109', 'pass123#', 'non-member', 'Physics', ''),
(96, 'Barış', 'Arslan', 21234987, '21234987@emu.edu.tr', '+905282109876', 'pass123#', 'non-member', 'Economics', ''),
(98, 'Kaan', 'Şimşek', 24398741, '24398741@emu.edu.tr', '+905280987654', 'pass123#', 'non-member', 'Computer Engineering', ''),
(100, 'Eren', 'Koç', 20234679, '20234679@emu.edu.tr', '+905278765432', 'pass123#', 'non-member', 'Mathematics', ''),
(102, 'Emre', 'Tan', 23124567, '23124567@emu.edu.tr', '+905397654321', 'pass123#', 'president', 'Tourism and Hospitality Management', ''),
(103, 'Buse', 'Kaya', 24125678, '24125678@emu.edu.tr', '+905396543210', 'pass123#', 'president', 'Theatre and Performing Arts', ''),
(104, 'Zeynep', 'Karaca', 22123456, '22123456@emu.edu.tr', '+905398761234', 'pass123#', 'president', 'International Relations', ''),
(105, 'Luna', 'Kaya', 21098765, '21098765@emu.edu.tr', '+905301234567', 'pass123#', 'member', 'Robotics', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(106, 'Eren', 'Demir111', 21098766, '21098766@emu.edu.tr', '+2275622477', 'pass123#', 'member', 'Oceanography', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(107, 'Mira', 'Saprtuw', 21098768, '21098768@emu.edu.tr', '+905303219876', 'pass123#', 'member', 'History', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749414562/profile_picture/lfzhjfvv7qvydeautmnt.jpg'),
(108, 'Leyla', 'Benay', 23235787, '23235787@emu.edu.tr', '+905337712583', 'pass123#', 'member', 'Political Science', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749416432/profile_picture/begzlisqk4z6egwyiwkh.jpg'),
(109, 'Bob', 'Sorbt', 22684322, '22684322@emu.edu.tr', '+9053376842345', 'pass123#', 'member', 'Finance', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(110, 'Alena', 'Shygarina', 23451256, '23451256@emu.edu.tr', '+90533716545', 'pass123#', 'member', 'English Literature', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749416762/profile_picture/djrtquybteijhjh0ljtd.jpg'),
(111, 'Amanda', 'Wryts', 21459673, '21459673@emu.edu.tr', '+90 532 321 6549', 'pass123#', 'member', 'Aeronautical Engineering', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(112, 'Mirafzal', 'Kutuzov', 2147483647, '2273834691@emu.edu.tr', '+90 534 876 5432', 'pass123#', 'member', 'Music', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(113, 'Larisa', 'Kazimirova', 22368341, '22368341@emu.edu.tr', '+90 536 778 8990', 'pass123#', 'member', 'Sociology', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749417748/profile_picture/gtsjmxdsfowadjotlelu.jpg'),
(114, 'Cemal', 'Gunduz', 22337658, '22337658@emu.edu.tr', '+90 552 667 8899', 'pass123#', 'member', 'Biotechnology', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749417982/profile_picture/xo6w5csze3olknt2xug7.jpg'),
(115, 'Baran', 'Esemen', 22462482, '22462482@emu.edu.tr', '+90 539 999 0001', 'pass123#', 'member', 'Nursing', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(116, 'Aise', 'Lonova', 24567683, '24567683@emu.edu.tr', '+90 533 123 4567', 'pass123#', 'member', 'Theology', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(117, 'Sara', 'Marlel', 24567337, '24567337@emu.edu.tr', '+90 533 234 5678', 'pass123#', 'member', 'Linguistics', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(118, 'Paul', 'Sokolovsy', 24567635, '24567635@emu.edu.tr', '+90 533 890 1234', 'pass123#', 'member', 'Marketing', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(119, 'Natasha', 'Lydskaya', 25738696, '25738696@emu.edu.tr', '+90 533 901 2345', 'pass123#', 'member', 'Economics', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749419283/profile_picture/pqndjbwr94dhwokm50gj.jpg'),
(120, 'Valera', 'Kurtanov', 25768696, '25768696@emu.edu.tr', '+90 542 333 4455', 'pass123#', 'member', 'Performing Arts', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749419477/profile_picture/ahmjwcpb9ychmzq69vdu.jpg'),
(121, 'Маша', 'Раванова', 25687946, '25687946@emu.edu.tr', '+90 542 444 5566', 'pass123#', 'member', 'Veterinary Medicine', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(122, 'Ferity', 'Spetin', 24768393, '24768393@emu.edu.tr', '+90 542 666 7788', 'pass123#', 'member', 'Sociology', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(123, 'sara', 'solta', 22222222, '34500678@emu.edu.tr', '456789546780', 'pass123#', 'non-member', 'Computer Science', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(124, 'somayeh', 'ahmadi', 23700643, '23700888@emu.edu.tr', '+908787576586', 'pass123#', 'president', 'Economics', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(125, 'Temi', 'Sana', 21990021, '21990021@emu.edu.tr', '05488900122', 'Temi123@', 'member', 'Biotechnology', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1750081008/profile_picture/x62qeah82hdctmxba6aw.png'),
(126, 'ikram', 'maria', 20801930, 'ikrampratic11@emu.edu.tr', '05488637383', 'maria maria8', 'member', 'Information Technology', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg'),
(127, 'eman', 'azer', 34567832, '34567832@emu.edu.tr', '05338535367', 'EMAN ARIG123@', 'member', 'Architecture', 'https://res.cloudinary.com/dl7wibkyz/image/upload/v1749229526/default_profile_wbj825.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `votes`
--

INSERT INTO `votes` (`id`, `member_id`, `candidate_id`, `club_id`, `date`) VALUES
(8, 71, 10, 17, '2025-06-11 10:51:39');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_announcement_president` (`club_id`);

--
-- Index pour la table `candidate`
--
ALTER TABLE `candidate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `club_id` (`club_id`),
  ADD KEY `FK_candidate_members` (`student_id`);

--
-- Index pour la table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `club`
--
ALTER TABLE `club`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `club_requests`
--
ALTER TABLE `club_requests`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `election_status`
--
ALTER TABLE `election_status`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `event1`
--
ALTER TABLE `event1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_event1_president` (`club_id`);

--
-- Index pour la table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `help_tutorial`
--
ALTER TABLE `help_tutorial`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `club_id` (`club_id`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notification_club` (`club_id`);

--
-- Index pour la table `president`
--
ALTER TABLE `president`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD UNIQUE KEY `club_id` (`club_id`);

--
-- Index pour la table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `request_club_fk` (`club_id`);

--
-- Index pour la table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_vote_per_member_per_club` (`member_id`,`club_id`),
  ADD KEY `candidate_id` (`candidate_id`),
  ADD KEY `club_id` (`club_id`),
  ADD KEY `FK_votes_members` (`member_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `candidate`
--
ALTER TABLE `candidate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT pour la table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `club`
--
ALTER TABLE `club`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT pour la table `club_requests`
--
ALTER TABLE `club_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `election_status`
--
ALTER TABLE `election_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `event1`
--
ALTER TABLE `event1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `faq`
--
ALTER TABLE `faq`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `help_tutorial`
--
ALTER TABLE `help_tutorial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `president`
--
ALTER TABLE `president`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `request`
--
ALTER TABLE `request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT pour la table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `announcement`
--
ALTER TABLE `announcement`
  ADD CONSTRAINT `FK_announcement_president` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `announcement_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `FK_candidate_members` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidate_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidate_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `event1`
--
ALTER TABLE `event1`
  ADD CONSTRAINT `FK_event1_president` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event1_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `members_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `members_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `fk_notification_club` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `president`
--
ALTER TABLE `president`
  ADD CONSTRAINT `FK_president_members` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `president_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `president_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_club_fk` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `request_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `FK_votes_members` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votes_ibfk_3` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
