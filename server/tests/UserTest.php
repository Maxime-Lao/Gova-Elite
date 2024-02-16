<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Zenstruck\Foundry\Test\ResetDatabase;

class UserTest extends ApiTestCase
{
    use ResetDatabase;
    public function testGetUsers(): void
    {
        $client = self::createClient();

        $client->request('GET', 'api/users', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/json+ld',

            ],
        ]);

        $this->assertResponseIsSuccessful();

        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@id' => '/api/users',
            '@type' => 'hydra:Collection',
        ]);
    }

}
