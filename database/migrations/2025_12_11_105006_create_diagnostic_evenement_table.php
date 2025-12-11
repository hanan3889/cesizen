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
        Schema::create('diagnostic_evenement', function (Blueprint $table) {
            // Clés primaires composites
            $table->foreignId('diagnostic_stress_id')
                  ->constrained('diagnostic_stresses')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreignId('evenement_vie_id')
                  ->constrained('evenement_vies')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            
            $table->timestamp('date_selection')->useCurrent();
            
            // Clé primaire composite
            $table->primary(['diagnostic_stress_id', 'evenement_vie_id']);
            
            // Index pour les recherches
            $table->index('diagnostic_stress_id');
            $table->index('evenement_vie_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnostic_evenement');
    }
};
