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
        Schema::create('historique_diagnostics', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date_consultation')->useCurrent();
            
            // Clés étrangères
            $table->foreignId('utilisateur_id')
                  ->constrained('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreignId('diagnostic_stress_id')
                  ->constrained('diagnostic_stresses')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->timestamps();
            
            // Index pour les recherches
            $table->index('utilisateur_id');
            $table->index('diagnostic_stress_id');
            $table->index('date_consultation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_diagnostics');
    }
};
