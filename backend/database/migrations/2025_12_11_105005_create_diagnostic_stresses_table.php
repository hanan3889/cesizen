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
        Schema::create('diagnostic_stresses', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date');
            $table->unsignedInteger('score')->default(0);
            $table->json('details_resultats')->nullable();
            
            // Clés étrangères
            $table->foreignId('utilisateur_id')
                  ->constrained('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreignId('administrateur_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null')
                  ->onUpdate('cascade');
            
            $table->timestamps();
            
            // Index pour les recherches et statistiques
            $table->index('utilisateur_id');
            $table->index('date');
            $table->index('score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnostic_stresses');
    }
};
