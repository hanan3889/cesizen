<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('page_informations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('statut', ['brouillon', 'publie', 'archive'])
                  ->default('brouillon');
            
            // Clés étrangères
            $table->foreignId('categorie_information_id')
                  ->constrained('categorie_informations')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            
            $table->foreignId('administrateur_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null')
                  ->onUpdate('cascade');
            
            $table->timestamps();
            
            // Index pour les recherches fréquentes
            $table->index('statut');
            $table->index('categorie_information_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_informations');
    }
};
