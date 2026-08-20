CREATE TABLE `consultationRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`visaType` varchar(80) NOT NULL,
	`preferredDate` varchar(20) NOT NULL,
	`preferredTime` varchar(40) NOT NULL,
	`message` text,
	`status` enum('new','contacted','scheduled','closed') NOT NULL DEFAULT 'new',
	`source` varchar(40) NOT NULL DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consultationRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactEnquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40),
	`subject` varchar(160) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','replied','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactEnquiries_id` PRIMARY KEY(`id`)
);
