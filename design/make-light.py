# -*- coding: utf-8 -*-
"""Light.dc.html is the same page as Main.dc.html, not a separate design.

Regenerate it after every change to Main:  python make-light.py

Two things do not simply invert. The bright bone band is the page's one
contrasting slab, so on paper it has to become the dark one; and the teal
statement band is already dark enough to stay as it is on either ground.
"""
import io, re, sys

s = io.open('Main.dc.html', encoding='utf-8').read()

# --- the two bands that keep their own logic, parked out of the palette map
KEEP = {}
def park(frag, replacement=None):
    key = '\x00K%d\x00' % len(KEEP)
    assert s.count(frag) == 1, frag[:60]
    KEEP[key] = replacement if replacement is not None else frag
    return key

s = s.replace('background: #EDEFEA; color: #0A0B0D;',
              park('background: #EDEFEA; color: #0A0B0D;', 'background: #0B0F14; color: #EDEFEA;'))
s = s.replace('background: #06272E;', park('background: #06272E;'))

# the inverted band's interior, before the generic map bleaches it
for a, b in [('border-left: 2px solid #0A0B0D;', 'border-left: 2px solid #0E7490;'),
             ('color: #3A4149;', 'color: #A8B0BA;'),
             ('color: #5A6069;', 'color: #8992A0;'),
             ('color: #23282E;', 'color: #D2D8DE;')]:
    s = s.replace(a, b)

PALETTE = [
    ('rgba(7,7,8,0)', 'rgba(240,243,246,0)'),
    ('rgba(7,7,8,',   'rgba(240,243,246,'),
    ('rgba(255,255,255,', 'rgba(11,15,20,'),
    ('rgba(0,217,255,',   'rgba(14,116,144,'),
    ('rgba(0,120,160,',   'rgba(14,116,144,'),
    ('rgba(167,139,250,', 'rgba(109,40,217,'),
    ('#22d3ee', '#0891B2'),
    ('rgba(16,19,23,0.86)', 'rgba(255,255,255,0.92)'),
    ('#9BE9FA', '#0C6579'), ('#7FF0FF', '#12A0C0'),
    ('#070708', '#F0F3F6'),   # ground
    ('#101317', '#E0E6EC'),   # band — needs a real step down from the ground
    ('#191D22', '#FFFFFF'),   # card inside a band
    ('#0d0e10', '#FFFFFF'),   # card
    ('#14171B', '#E6EAEE'),   # browser chrome
    ('#0A0C0F', '#FFFFFF'),
    ('#101418', '#FAFBFC'), ('#0B0E11', '#F2F4F7'), ('#0A1418', '#EFF4F6'),
    ('#0a0b0c', '#E6EAEE'), ('#101215', '#E6EAEE'),
    ('#ffffff', '#0B0F14'),   # ink
    ('#b9bec6', '#414B57'), ('#8b929c', '#5A6472'), ('#7d8590', '#5A6472'),
    ('#4d5561', '#8992A0'), ('#35404d', '#7A8492'),
    ('#262D34', '#C2C9D1'), ('#2A3138', '#C2C9D1'), ('#2F3941', '#A8B0BA'),
    ('#00eeff', '#0C6579'), ('#00d9ff', '#0E7490'),
]
for a, b in PALETTE:
    s = s.replace(a, b)

for key, val in KEEP.items():
    s = s.replace(key, val)

# grain is texture on black and dirt on paper
s = s.replace('pointer-events: none; opacity: 0.16;', 'pointer-events: none; opacity: 0.05;')

# a hairline is enough on black; white cards need to lift off the ground
s = s.replace(
    'background: #FFFFFF; border: 1px solid rgba(11,15,20,0.09); border-top: 2px solid',
    'background: #FFFFFF; box-shadow: 0 1px 2px rgba(11,15,20,0.05), 0 16px 34px -18px rgba(11,15,20,0.22); '
    'border: 1px solid rgba(11,15,20,0.08); border-top: 2px solid')

# the six service accents are tuned for a black ground
for a, b in [('#f59e0b', '#B45309'), ('#ec4899', '#BE185D'), ('#a78bfa', '#6D28D9'),
             ('#8b5cf6', '#5B21B6'), ('#22c55e', '#15803D')]:
    s = s.replace(a, b)
s = s.replace('background: #B45309; color: #F0F3F6;', 'background: #B45309; color: #FFFFFF;')

# the hero's angled slab is a 9% wash: readable on black, invisible on paper
# the hero's glows are tuned for black; on paper they need more of themselves
s = s.replace('background: #0E7490; opacity: 0.09;', 'background: #0E7490; opacity: 0.17;')
s = s.replace('background: #0E7490; opacity: 0.10; filter: blur(90px);',
              'background: #0E7490; opacity: 0.16; filter: blur(90px);')
s = s.replace('<span style="color: #0E7490;">Ik blijf kijken.</span>',
              '<span style="color: #4FD8F5;">Ik blijf kijken.</span>')  # sits on the dark teal band

io.open('Light.dc.html', 'w', encoding='utf-8', newline='').write(s)
print('Light.dc.html regenerated from Main.dc.html')
