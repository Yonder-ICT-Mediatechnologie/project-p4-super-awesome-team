-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 19 jun 2025 om 16:02
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hangman_game`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `game_scores`
--

CREATE TABLE `game_scores` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `word` varchar(100) NOT NULL,
  `score` int(11) NOT NULL,
  `attempts_used` int(11) NOT NULL,
  `result` enum('Won','Lost') NOT NULL,
  `played_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `game_scores`
--

INSERT INTO `game_scores` (`id`, `user_id`, `word`, `score`, `attempts_used`, `result`, `played_at`) VALUES
(1, 1, 'revet', 80, 0, 'Won', '2025-06-17 08:19:25'),
(2, 1, 'shamefully', 130, 0, 'Won', '2025-06-17 08:19:30'),
(3, 1, 'diddlers', 110, 0, 'Won', '2025-06-17 08:19:38'),
(4, 1, 'flits', 65, 3, 'Won', '2025-06-19 13:13:35'),
(5, 1, 'renotifying', 140, 0, 'Won', '2025-06-19 13:33:46');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `game_sessions`
--

CREATE TABLE `game_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `remember_me` tinyint(1) DEFAULT 0,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `game_sessions`
--

INSERT INTO `game_sessions` (`id`, `user_id`, `session_token`, `remember_me`, `expires_at`, `created_at`) VALUES
(18, 2, '434c281a5e774b6a9bab555891522f6c56be802e0540dc258d8c1c97d9340816', 0, '2025-06-18 09:09:39', '2025-06-17 08:09:39'),
(29, 1, '41b52dce52fb6470ceb482527801d6db2cc2f03d8669e1a35b404d721c16f104', 0, '2025-06-20 14:45:21', '2025-06-19 13:45:21');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`, `last_login`, `is_active`) VALUES
(1, '123', '123@gmail.com', '$2y$10$JUD9jGdROQoEeYEOz62pc.jWbFG9Q1F/DebbdaMNhH/p53rtEXH0u', '2025-06-16 15:28:06', '2025-06-19 13:45:21', '2025-06-19 13:45:21', 1),
(2, 'gijs', 'gijs@gmail.com', '$2y$10$n9ulKzBgUAxlhgRU3srIxeBemVWVAFmjA2g4jEiQK21x6RnLFk78q', '2025-06-17 08:09:32', '2025-06-17 08:09:39', '2025-06-17 08:09:39', 1);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user_stats`
--

CREATE TABLE `user_stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_games` int(11) DEFAULT 0,
  `games_won` int(11) DEFAULT 0,
  `win_rate` decimal(5,2) DEFAULT 0.00,
  `current_streak` int(11) DEFAULT 0,
  `best_streak` int(11) DEFAULT 0,
  `total_score` int(11) DEFAULT 0,
  `best_score` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `user_stats`
--

INSERT INTO `user_stats` (`id`, `user_id`, `total_games`, `games_won`, `win_rate`, `current_streak`, `best_streak`, `total_score`, `best_score`, `updated_at`) VALUES
(1, 1, 5, 5, 100.00, 5, 5, 525, 140, '2025-06-19 13:33:46');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `game_scores`
--
ALTER TABLE `game_scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexen voor tabel `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexen voor tabel `user_stats`
--
ALTER TABLE `user_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_stats` (`user_id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `game_scores`
--
ALTER TABLE `game_scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT voor een tabel `game_sessions`
--
ALTER TABLE `game_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT voor een tabel `user_stats`
--
ALTER TABLE `user_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `game_scores`
--
ALTER TABLE `game_scores`
  ADD CONSTRAINT `game_scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD CONSTRAINT `game_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `user_stats`
--
ALTER TABLE `user_stats`
  ADD CONSTRAINT `user_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
