<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231206173239 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notice DROP CONSTRAINT fk_480d45c2df0fd358');
        $this->addSql('DROP INDEX idx_480d45c2df0fd358');
        $this->addSql('ALTER TABLE notice RENAME COLUMN userr_id TO user_id');
        $this->addSql('ALTER TABLE notice ADD CONSTRAINT FK_480D45C2A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_480D45C2A76ED395 ON notice (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE notice DROP CONSTRAINT FK_480D45C2A76ED395');
        $this->addSql('DROP INDEX IDX_480D45C2A76ED395');
        $this->addSql('ALTER TABLE notice RENAME COLUMN user_id TO userr_id');
        $this->addSql('ALTER TABLE notice ADD CONSTRAINT fk_480d45c2df0fd358 FOREIGN KEY (userr_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_480d45c2df0fd358 ON notice (userr_id)');
    }
}
