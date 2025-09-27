#!/usr/bin/env python3

import subprocess
import sys
import os

def run_seed():
    """Run the seed script to populate the database"""
    try:
        # Change to server directory
        os.chdir('server')
        
        # Run the seed script
        result = subprocess.run([sys.executable, 'seed.py'], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Database seeded successfully!")
            print(result.stdout)
        else:
            print("❌ Error seeding database:")
            print(result.stderr)
            
    except Exception as e:
        print(f"❌ Error running seed: {e}")

if __name__ == "__main__":
    run_seed()