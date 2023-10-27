<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231026192435 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE brand_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE car_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE category_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE companie_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE energy_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE gear_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE media_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE model_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE notice_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE notification_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE reason_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE rent_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE role_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE brand (id INT NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE car (id INT NOT NULL, gear_id INT NOT NULL, model_id INT DEFAULT NULL, rent_id INT DEFAULT NULL, energy_id INT NOT NULL, companie_id INT NOT NULL, year INT NOT NULL, horses INT NOT NULL, nb_seats INT NOT NULL, nb_doors INT NOT NULL, price DOUBLE PRECISION NOT NULL, mileage INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_773DE69D77201934 ON car (gear_id)');
        $this->addSql('CREATE INDEX IDX_773DE69D7975B7E7 ON car (model_id)');
        $this->addSql('CREATE INDEX IDX_773DE69DE5FD6250 ON car (rent_id)');
        $this->addSql('CREATE INDEX IDX_773DE69DEDDF52D ON car (energy_id)');
        $this->addSql('CREATE INDEX IDX_773DE69D9DC4CE1F ON car (companie_id)');
        $this->addSql('CREATE TABLE category (id INT NOT NULL, libelle VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE companie (id INT NOT NULL, name VARCHAR(100) NOT NULL, address VARCHAR(255) NOT NULL, zip_code INT NOT NULL, city VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE energy (id INT NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE gear (id INT NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE media (id INT NOT NULL, car_id INT NOT NULL, userr_id INT NOT NULL, name VARCHAR(255) NOT NULL, data VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6A2CA10CC3C6F69F ON media (car_id)');
        $this->addSql('CREATE INDEX IDX_6A2CA10CDF0FD358 ON media (userr_id)');
        $this->addSql('CREATE TABLE model (id INT NOT NULL, brand_id INT NOT NULL, name VARCHAR(100) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D79572D944F5D008 ON model (brand_id)');
        $this->addSql('CREATE TABLE notice (id INT NOT NULL, companie_id INT NOT NULL, userr_id INT DEFAULT NULL, message VARCHAR(255) NOT NULL, nb_stars INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_480D45C29DC4CE1F ON notice (companie_id)');
        $this->addSql('CREATE INDEX IDX_480D45C2DF0FD358 ON notice (userr_id)');
        $this->addSql('COMMENT ON COLUMN notice.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE notification (id INT NOT NULL, userr_id INT NOT NULL, message VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_BF5476CADF0FD358 ON notification (userr_id)');
        $this->addSql('CREATE TABLE reason (id INT NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE rent (id INT NOT NULL, date_start DATE NOT NULL, date_end DATE NOT NULL, total_price INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN rent.date_start IS \'(DC2Type:date_immutable)\'');
        $this->addSql('COMMENT ON COLUMN rent.date_end IS \'(DC2Type:date_immutable)\'');
        $this->addSql('CREATE TABLE role (id INT NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, role_id INT DEFAULT NULL, firstname VARCHAR(100) NOT NULL, lastname VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, password VARCHAR(255) NOT NULL, phone VARCHAR(15) NOT NULL, is_verified BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_8D93D649D60322AC ON "user" (role_id)');
        $this->addSql('CREATE TABLE messenger_messages (id BIGSERIAL NOT NULL, body TEXT NOT NULL, headers TEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, available_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, delivered_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_75EA56E0FB7336F0 ON messenger_messages (queue_name)');
        $this->addSql('CREATE INDEX IDX_75EA56E0E3BD61CE ON messenger_messages (available_at)');
        $this->addSql('CREATE INDEX IDX_75EA56E016BA31DB ON messenger_messages (delivered_at)');
        $this->addSql('COMMENT ON COLUMN messenger_messages.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.available_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.delivered_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE OR REPLACE FUNCTION notify_messenger_messages() RETURNS TRIGGER AS $$
            BEGIN
                PERFORM pg_notify(\'messenger_messages\', NEW.queue_name::text);
                RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;');
        $this->addSql('DROP TRIGGER IF EXISTS notify_trigger ON messenger_messages;');
        $this->addSql('CREATE TRIGGER notify_trigger AFTER INSERT OR UPDATE ON messenger_messages FOR EACH ROW EXECUTE PROCEDURE notify_messenger_messages();');
        $this->addSql('ALTER TABLE car ADD CONSTRAINT FK_773DE69D77201934 FOREIGN KEY (gear_id) REFERENCES gear (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE car ADD CONSTRAINT FK_773DE69D7975B7E7 FOREIGN KEY (model_id) REFERENCES model (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE car ADD CONSTRAINT FK_773DE69DE5FD6250 FOREIGN KEY (rent_id) REFERENCES rent (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE car ADD CONSTRAINT FK_773DE69DEDDF52D FOREIGN KEY (energy_id) REFERENCES energy (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE car ADD CONSTRAINT FK_773DE69D9DC4CE1F FOREIGN KEY (companie_id) REFERENCES companie (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE media ADD CONSTRAINT FK_6A2CA10CC3C6F69F FOREIGN KEY (car_id) REFERENCES car (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE media ADD CONSTRAINT FK_6A2CA10CDF0FD358 FOREIGN KEY (userr_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE model ADD CONSTRAINT FK_D79572D944F5D008 FOREIGN KEY (brand_id) REFERENCES brand (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE notice ADD CONSTRAINT FK_480D45C29DC4CE1F FOREIGN KEY (companie_id) REFERENCES companie (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE notice ADD CONSTRAINT FK_480D45C2DF0FD358 FOREIGN KEY (userr_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CADF0FD358 FOREIGN KEY (userr_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649D60322AC FOREIGN KEY (role_id) REFERENCES role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE brand_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE car_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE category_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE companie_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE energy_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE gear_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE media_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE model_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE notice_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE notification_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE reason_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE rent_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE role_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('ALTER TABLE car DROP CONSTRAINT FK_773DE69D77201934');
        $this->addSql('ALTER TABLE car DROP CONSTRAINT FK_773DE69D7975B7E7');
        $this->addSql('ALTER TABLE car DROP CONSTRAINT FK_773DE69DE5FD6250');
        $this->addSql('ALTER TABLE car DROP CONSTRAINT FK_773DE69DEDDF52D');
        $this->addSql('ALTER TABLE car DROP CONSTRAINT FK_773DE69D9DC4CE1F');
        $this->addSql('ALTER TABLE media DROP CONSTRAINT FK_6A2CA10CC3C6F69F');
        $this->addSql('ALTER TABLE media DROP CONSTRAINT FK_6A2CA10CDF0FD358');
        $this->addSql('ALTER TABLE model DROP CONSTRAINT FK_D79572D944F5D008');
        $this->addSql('ALTER TABLE notice DROP CONSTRAINT FK_480D45C29DC4CE1F');
        $this->addSql('ALTER TABLE notice DROP CONSTRAINT FK_480D45C2DF0FD358');
        $this->addSql('ALTER TABLE notification DROP CONSTRAINT FK_BF5476CADF0FD358');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649D60322AC');
        $this->addSql('DROP TABLE brand');
        $this->addSql('DROP TABLE car');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE companie');
        $this->addSql('DROP TABLE energy');
        $this->addSql('DROP TABLE gear');
        $this->addSql('DROP TABLE media');
        $this->addSql('DROP TABLE model');
        $this->addSql('DROP TABLE notice');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE reason');
        $this->addSql('DROP TABLE rent');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
