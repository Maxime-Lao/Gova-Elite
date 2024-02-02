<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240128175718 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media_object ADD car_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_object ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132C3C6F69F FOREIGN KEY (car_id) REFERENCES car (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_14D43132C3C6F69F ON media_object (car_id)');
        $this->addSql('CREATE INDEX IDX_14D43132A76ED395 ON media_object (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D43132C3C6F69F');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D43132A76ED395');
        $this->addSql('DROP INDEX IDX_14D43132C3C6F69F');
        $this->addSql('DROP INDEX IDX_14D43132A76ED395');
        $this->addSql('ALTER TABLE media_object DROP car_id');
        $this->addSql('ALTER TABLE media_object DROP user_id');
    }
}
