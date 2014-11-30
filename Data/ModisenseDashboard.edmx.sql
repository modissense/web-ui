
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, and Azure
-- --------------------------------------------------
-- Date Created: 04/24/2013 17:08:24
-- Generated from EDMX file: C:\inetpub\wwwroot\DNN705\DesktopModules\ModisenseDashboard\Data\ModisenseDashboard.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [Modisense];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_Modisense_UserProfileModisense_SocialNetwork_Modisense_UserProfile]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Modisense_UserProfileModisense_SocialNetwork] DROP CONSTRAINT [FK_Modisense_UserProfileModisense_SocialNetwork_Modisense_UserProfile];
GO
IF OBJECT_ID(N'[dbo].[FK_Modisense_UserProfileModisense_SocialNetwork_Modisense_SocialNetwork]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Modisense_UserProfileModisense_SocialNetwork] DROP CONSTRAINT [FK_Modisense_UserProfileModisense_SocialNetwork_Modisense_SocialNetwork];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[UserProfile]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserProfile];
GO
IF OBJECT_ID(N'[dbo].[Modisense_Socialgraph]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Modisense_Socialgraph];
GO
IF OBJECT_ID(N'[dbo].[Modisense_POI]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Modisense_POI];
GO
IF OBJECT_ID(N'[dbo].[Modisense_SocialNetwork]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Modisense_SocialNetwork];
GO
IF OBJECT_ID(N'[dbo].[Modisense_UserProfileModisense_SocialNetwork]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Modisense_UserProfileModisense_SocialNetwork];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Modisense_UserProfile'
CREATE TABLE [dbo].[Modisense_UserProfile] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Nickname] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Modisense_Socialgraph'
CREATE TABLE [dbo].[Modisense_Socialgraph] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Latitude] nvarchar(max)  NOT NULL,
    [Longitude] nvarchar(max)  NOT NULL,
    [StartTime] datetime  NOT NULL,
    [EndTime] datetime  NOT NULL,
    [Task] nvarchar(max)  NOT NULL,
    [TaskCategory] nvarchar(max)  NOT NULL,
    [Modisense_UserProfileId] int  NOT NULL
);
GO

-- Creating table 'Modisense_POI'
CREATE TABLE [dbo].[Modisense_POI] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Latitude] float  NOT NULL,
    [Longitude] float  NOT NULL,
    [Name] nvarchar(max)  NOT NULL,
    [Category] nvarchar(max)  NOT NULL,
    [Other] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Modisense_SocialNetwork'
CREATE TABLE [dbo].[Modisense_SocialNetwork] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Modisense_UserProfileModisense_SocialNetwork'
CREATE TABLE [dbo].[Modisense_UserProfileModisense_SocialNetwork] (
    [Modisense_UserProfile_Id] int  NOT NULL,
    [Modisense_SocialNetwork_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Modisense_UserProfile'
ALTER TABLE [dbo].[Modisense_UserProfile]
ADD CONSTRAINT [PK_Modisense_UserProfile]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Modisense_Socialgraph'
ALTER TABLE [dbo].[Modisense_Socialgraph]
ADD CONSTRAINT [PK_Modisense_Socialgraph]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Modisense_POI'
ALTER TABLE [dbo].[Modisense_POI]
ADD CONSTRAINT [PK_Modisense_POI]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Modisense_SocialNetwork'
ALTER TABLE [dbo].[Modisense_SocialNetwork]
ADD CONSTRAINT [PK_Modisense_SocialNetwork]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Modisense_UserProfile_Id], [Modisense_SocialNetwork_Id] in table 'Modisense_UserProfileModisense_SocialNetwork'
ALTER TABLE [dbo].[Modisense_UserProfileModisense_SocialNetwork]
ADD CONSTRAINT [PK_Modisense_UserProfileModisense_SocialNetwork]
    PRIMARY KEY NONCLUSTERED ([Modisense_UserProfile_Id], [Modisense_SocialNetwork_Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [Modisense_UserProfile_Id] in table 'Modisense_UserProfileModisense_SocialNetwork'
ALTER TABLE [dbo].[Modisense_UserProfileModisense_SocialNetwork]
ADD CONSTRAINT [FK_Modisense_UserProfileModisense_SocialNetwork_Modisense_UserProfile]
    FOREIGN KEY ([Modisense_UserProfile_Id])
    REFERENCES [dbo].[Modisense_UserProfile]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Modisense_SocialNetwork_Id] in table 'Modisense_UserProfileModisense_SocialNetwork'
ALTER TABLE [dbo].[Modisense_UserProfileModisense_SocialNetwork]
ADD CONSTRAINT [FK_Modisense_UserProfileModisense_SocialNetwork_Modisense_SocialNetwork]
    FOREIGN KEY ([Modisense_SocialNetwork_Id])
    REFERENCES [dbo].[Modisense_SocialNetwork]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_Modisense_UserProfileModisense_SocialNetwork_Modisense_SocialNetwork'
CREATE INDEX [IX_FK_Modisense_UserProfileModisense_SocialNetwork_Modisense_SocialNetwork]
ON [dbo].[Modisense_UserProfileModisense_SocialNetwork]
    ([Modisense_SocialNetwork_Id]);
GO

-- Creating foreign key on [Modisense_UserProfileId] in table 'Modisense_Socialgraph'
ALTER TABLE [dbo].[Modisense_Socialgraph]
ADD CONSTRAINT [FK_Modisense_UserProfileModisense_Socialgraph]
    FOREIGN KEY ([Modisense_UserProfileId])
    REFERENCES [dbo].[Modisense_UserProfile]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_Modisense_UserProfileModisense_Socialgraph'
CREATE INDEX [IX_FK_Modisense_UserProfileModisense_Socialgraph]
ON [dbo].[Modisense_Socialgraph]
    ([Modisense_UserProfileId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------