import 'package:flutter/material.dart';

class LandingScreen extends StatelessWidget {
  final VoidCallback onStartPressed;

  const LandingScreen({super.key, required this.onStartPressed});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0B),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(),
            _buildHeroSection(),
            _buildHowItWorks(),
            _buildFeatures(),
            _buildCTA(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0B).withValues(alpha: 0.9),
        border: const Border(
          bottom: BorderSide(color: Color(0xFF27272A)),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Logo
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.bar_chart,
                  color: Color(0xFF6366F1),
                  size: 24,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'Pokerly',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          // Start button
          ElevatedButton(
            onPressed: onStartPressed,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6366F1),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              '시작하기',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroSection() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 80),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            const Color(0xFF6366F1).withValues(alpha: 0.1),
            Colors.transparent,
          ],
        ),
      ),
      child: Column(
        children: [
          // Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF141416),
              borderRadius: BorderRadius.circular(50),
              border: Border.all(color: const Color(0xFF27272A)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('✨', style: TextStyle(fontSize: 14)),
                const SizedBox(width: 8),
                Text(
                  '200명 이상의 플레이어가 사용 중',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withValues(alpha: 0.6),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Main title
          const Text(
            '스크린샷 한 장으로',
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              height: 1.2,
            ),
            textAlign: TextAlign.center,
          ),
          ShaderMask(
            shaderCallback: (bounds) => const LinearGradient(
              colors: [Color(0xFF6366F1), Color(0xFFA855F7)],
            ).createShader(bounds),
            child: const Text(
              '포커 실력을 분석하세요',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                height: 1.2,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),

          // Subtitle
          Text(
            '게임 화면만 찍으면 AI가 자동으로 데이터를 추출합니다.\n복잡한 입력 없이 당신의 수익률을 한눈에 확인하세요.',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white.withValues(alpha: 0.6),
              height: 1.6,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 40),

          // CTA Buttons
          Wrap(
            spacing: 16,
            runSpacing: 16,
            alignment: WrapAlignment.center,
            children: [
              ElevatedButton(
                onPressed: onStartPressed,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '무료로 시작하기',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                    ),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward, size: 20),
                  ],
                ),
              ),
              OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  side: const BorderSide(color: Color(0xFF27272A)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.play_arrow, size: 20),
                    SizedBox(width: 8),
                    Text(
                      '데모 보기',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 48),

          // Trust indicators
          Wrap(
            spacing: 24,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: [
              _buildTrustItem(Icons.lock_outline, '개인정보 보호'),
              _buildTrustItem(Icons.bolt, '3초만에 분석'),
              _buildTrustItem(Icons.credit_card_off, '신용카드 불필요'),
            ],
          ),
          const SizedBox(height: 64),

          // Dashboard preview
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF141416),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF27272A)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.5),
                  blurRadius: 50,
                  offset: const Offset(0, 25),
                ),
              ],
            ),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF0A0A0B),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.bar_chart,
                    size: 64,
                    color: const Color(0xFF6366F1).withValues(alpha: 0.8),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '대시보드 미리보기',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.6),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustItem(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: Colors.white.withValues(alpha: 0.6)),
        const SizedBox(width: 8),
        Text(
          text,
          style: TextStyle(
            fontSize: 14,
            color: Colors.white.withValues(alpha: 0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildHowItWorks() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 80),
      child: Column(
        children: [
          const Text(
            '어떻게 작동하나요?',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 48),
          Wrap(
            spacing: 24,
            runSpacing: 24,
            alignment: WrapAlignment.center,
            children: [
              _buildStep('1', Icons.camera_alt, '스크린샷 촬영', '게임 결과 화면을\n캡처하세요'),
              _buildStep('2', Icons.auto_awesome, 'AI 분석', 'AI가 자동으로\n데이터를 추출해요'),
              _buildStep('3', Icons.insights, '통계 확인', '상세한 분석 결과를\n확인하세요'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep(String number, IconData icon, String title, String description) {
    return Container(
      width: 280,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF141416),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF27272A)),
      ),
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: const Color(0xFF6366F1).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF6366F1),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Icon(icon, size: 32, color: const Color(0xFF6366F1)),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withValues(alpha: 0.6),
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildFeatures() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 80),
      color: const Color(0xFF141416),
      child: Column(
        children: [
          const Text(
            '주요 기능',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 48),
          Wrap(
            spacing: 24,
            runSpacing: 24,
            alignment: WrapAlignment.center,
            children: [
              _buildFeature(Icons.casino, '캐시게임 & 토너먼트', '모든 형태의 포커 게임을 지원합니다'),
              _buildFeature(Icons.analytics, '상세 통계', '시간대별, 위치별 상세 분석'),
              _buildFeature(Icons.emoji_events, '챌린지', '목표를 설정하고 달성하세요'),
              _buildFeature(Icons.cloud_sync, '클라우드 동기화', '모든 기기에서 접근 가능'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFeature(IconData icon, String title, String description) {
    return Container(
      width: 260,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF27272A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF6366F1).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, size: 24, color: const Color(0xFF6366F1)),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withValues(alpha: 0.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCTA() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 80),
      child: Column(
        children: [
          const Text(
            '지금 바로 시작하세요',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            '무료로 시작하고, 언제든 업그레이드하세요',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white.withValues(alpha: 0.6),
            ),
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            onPressed: onStartPressed,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6366F1),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 20),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              '무료로 시작하기',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
          ),
          const SizedBox(height: 48),
          Text(
            '© 2024 풍풍스튜디. All rights reserved.',
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withValues(alpha: 0.4),
            ),
          ),
        ],
      ),
    );
  }
}
