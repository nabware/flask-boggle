from unittest import TestCase

from app import app, games

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class BoggleAppTestCase(TestCase):
    """Test flask app of Boggle."""

    def setUp(self):
        """Stuff to do before every test."""

        app.config['TESTING'] = True

    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with app.test_client() as client:
            response = client.get('/')
            # test that you're getting a template
            html = response.get_data(as_text=True)

            self.assertEqual(response.status_code, 200)
            self.assertIn("<!-- homepage test check -->", html)

    def test_api_new_game(self):
        """Test starting a new game."""

        with app.test_client() as client:
            # write a test for this route
            response = client.post('/api/new-game')
            json = response.get_json()

            self.assertIsInstance(json, dict)
            self.assertIsInstance(json['game_id'], str)
            self.assertIsInstance(json['board'], list)
            self.assertIn(json['game_id'], games)

    def test_api_score_word(self):
        """Test scoring word."""

        with app.test_client() as client:
            # write a test for this route
            response = client.post('/api/new-game')
            json = response.get_json()

            game_id = json.get("game_id")
            games[game_id].board[0][0] = "C"
            games[game_id].board[0][1] = "A"
            games[game_id].board[0][2] = "T"

            data = {"game_id": game_id, "word": "CAT"}
            response = client.post('/api/score-word', json=data)
            json = response.get_json()

            self.assertEqual(json.get("result"), "ok")

