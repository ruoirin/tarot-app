"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import tarotCardsVietnamese from "@/data/tarot-cards-vietnamese-full"

interface TarotCard {
  name: string
  description: string
  imageURL: string
  cardBack: string
}

const TAROT_CARDS: TarotCard[] = tarotCardsVietnamese.map((card) => ({
  name: card.name,
  description: card.description,
  imageURL: card.imageURL,
  cardBack: card.cardBack,
}))

const CARD_BACK_IMAGE = TAROT_CARDS[0]?.cardBack || "/placeholder.svg?height=400&width=250&text=Card+Back"

export default function TarotApp() {
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([])
  const [readingStarted, setReadingStarted] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null) // New state for zoomed card

  const drawCards = () => {
    setDrawing(true)
    setDrawnCards([])
    setSelectedCard(null) // Clear selected card when drawing new ones

    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 3)
      setDrawnCards(selected)
      setReadingStarted(true)
      setDrawing(false)
    }, 1200)
  }

  const spreadLabels = ["Quá Khứ", "Hiện Tại", "Tương Lai"]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-4 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center drop-shadow-lg">Xem Bói Tarot</h1>

      <Button
        onClick={drawCards}
        className="mb-12 px-8 py-4 text-lg bg-purple-700 hover:bg-purple-800 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        disabled={drawing}
      >
        {readingStarted ? "Rút Bài Mới" : "Bắt Đầu Xem Bói"}
      </Button>

      <AnimatePresence mode="wait">
        {drawing ? (
          <motion.div
            key="drawing-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl text-white/70 font-semibold text-center h-48 flex items-center justify-center"
          >
            Đang xáo bài và rút bài...
          </motion.div>
        ) : readingStarted ? (
          <motion.div
            key="drawn-cards-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
          >
            {drawnCards.map((card, index) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 100, rotateY: 90, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, rotateY: -90, scale: 0.8 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onClick={() => setSelectedCard(card)} // Set selected card on click
                className="cursor-pointer hover:scale-105 transition-transform duration-300" // Add cursor and hover effect
              >
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-xl rounded-lg overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-semibold text-center">{card.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center p-4">
                    <div className="relative w-full mb-4 rounded-md overflow-hidden">
                      <Image
                        src={card.imageURL || "/placeholder.svg"}
                        alt={card.name}
                        width={300}
                        height={527}
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                    <p className="text-lg font-medium mb-2 text-purple-300">{spreadLabels[index]}</p>
                    <p className="text-sm text-white/80">{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="preview-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="w-64 h-auto relative mb-12"
          >
            <Image
              src={CARD_BACK_IMAGE || "/placeholder.svg"}
              alt="Tarot Card Back"
              width={300}
              height={527}
              className="w-full h-auto rounded-lg shadow-xl border-2 border-white/30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoomed Card Overlay */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCard(null)} // Close on overlay click
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl rounded-lg p-6 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
            >
              <Button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 bg-purple-700 hover:bg-purple-800 text-white rounded-full w-8 h-8 flex items-center justify-center p-0"
                aria-label="Đóng"
              >
                X
              </Button>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">{selectedCard.name}</h2>
                <div className="relative w-full max-w-[300px] mx-auto mb-6 rounded-md overflow-hidden">
                  <Image
                    src={selectedCard.imageURL || "/placeholder.svg"}
                    alt={selectedCard.name}
                    width={300}
                    height={527}
                    className="w-full h-auto rounded-md"
                  />
                </div>
                <p className="text-base text-white/90 leading-relaxed">{selectedCard.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
